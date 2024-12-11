import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { BasketData } from './components/BasketData';
import { Card } from './components/Card';
import { CardData } from './components/CardData';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Page } from './components/common/Page';
import { Contacts } from './components/Contacts';
import { Order } from './components/Order';
import { OrderData } from './components/OrderData';
import { Success } from './components/Success';
import './scss/styles.scss';
import { ICard, IOrder } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Инициализация компонентов

const events = new EventEmitter();

const orderData = new OrderData(events);
const cardsData = new CardData(events);
const basketData = new BasketData(events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const templates = {
	basketCard: ensureElement<HTMLTemplateElement>('#card-basket'),
	basket: ensureElement<HTMLTemplateElement>('#basket'),
	previewCard: ensureElement<HTMLTemplateElement>('#card-preview'),
	cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
	order: ensureElement<HTMLTemplateElement>('#order'),
	contacts: ensureElement<HTMLTemplateElement>('#contacts'),
	success: ensureElement<HTMLTemplateElement>('#success'),
};

const basket = new Basket(cloneTemplate(templates.basket), events);
const order = new Order(cloneTemplate(templates.order), events);
const contacts = new Contacts(cloneTemplate(templates.contacts), events);

// Инициализация API

const appApi = new AppApi(CDN_URL, API_URL, settings);

const loadCardsData = async () => {
	try {
		const data = await appApi.fetchCardsData();

		cardsData.cards = data.items;
		cardsData.total = data.total;

		events.emit('catalog:loaded');
	} catch {
		console.error('Ошибка при загрузке каталога товаров');
	}
};

// Обработчик события для каталога товаров

events.on('catalog:loaded', () => {
	page.catalog = cardsData.cards.map((cardData) => {
		const card = new Card(cloneTemplate(templates.cardCatalog), {
			onClick: () => events.emit('card:select', cardData),
		});

		return card.render(cardData);
	});
});

// Обработчики событий для страницы и модального окна

events.on('modal:open', () => (page.locked = true));
events.on('modal:close', () => (page.locked = false));

// Обработчики событий для превью товара

events.on('card:select', (preview: ICard) => {
	cardsData.setPreview(preview);
});

events.on('preview:change', (preview: ICard) => {
	if (preview) {
		const PreviewCard = new Card(cloneTemplate(templates.previewCard), {
			onClick: () => {
				if (basketData.checkItemInBasket(preview.id)) {
					PreviewCard.cardButton = 'В корзину';
					events.emit('remove-from-basket:submit', preview);
				} else {
					PreviewCard.cardButton = 'Убрать из корзины';
					events.emit('add-to-basket:submit', preview);
				}
			},
		});

		PreviewCard.cardButton = basketData.checkItemInBasket(preview.id)
			? 'Удалить из корзины'
			: 'В корзину';
		modal.render({ content: PreviewCard.render(preview) });
	}
});

// Обработчики событий для корзины

events.on('basket:open', () => {
	basket.button = basketData.items.length === 0;
	modal.render({ content: basket.render() });
});

events.on('add-to-basket:submit', () => {
	const card = cardsData.preview;

	basketData.setItem(card);

	if (card.price) basketData.price = card.price;

	events.emit('basket:change');
	events.emit('preview:change');
});

events.on('remove-from-basket:submit', (card: ICard) => {
	basketData.deleteItem(card.id);
	events.emit('basket:change');
	events.emit('preview:change');
});

events.on('basket:change', () => {
	page.counter = basketData.total;

	basket.items = basketData.items.map((item, index) => {
		const cardBasket = new Card(cloneTemplate(templates.basketCard), {
			onClick: () => {
				events.emit('remove-from-basket:submit', {
					...item,
					index: `${index + 1}`,
				});
			},
		});
		return cardBasket.render({ ...item, index: `${index + 1}` });
	});

	basket.button = basketData.items.length === 0;
	basket.price = basketData.price;
});

events.on('basket:submit', () => {
	orderData.setOrderField(
		'items',
		basketData.items.map((item) => item.id)
	);
	orderData.setOrderField('total', basketData.price);

	events.emit('order:open');
});

// Обработчики событий для оформления заказа

events.on('order:open', () => {
	const payment = orderData.getOrderField('payment');
	const address = orderData.getOrderField('address');

	modal.render({
		content: order.render({
			payment: payment,
			address: address,
			valid: !!payment && !!address,
			errors: [],
		}),
	});
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		orderData.setOrderField(data.field, data.value);
		orderData.validateOrder();
	}
);

events.on('formOrder:change', (errors: Partial<IOrder>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:submit', () => events.emit('contacts:open'));

// Обработчики событий для контактов

events.on('contacts:open', () => {
	const email = orderData.getOrderField('email');
	const phone = orderData.getOrderField('phone');

	modal.render({
		content: contacts.render({
			email: email,
			phone: phone,
			valid: !!email && !!phone,
			errors: [],
		}),
	});
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		orderData.setOrderField(data.field, data.value);
		orderData.validateContacts();
	}
);

events.on('formContacts:change', (errors: Partial<IOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:submit', async () => {
	try {
		contacts.valid = false;
		await appApi.sendOrder(orderData.order);

		events.emit('success:open', { total: orderData.getOrderField('total') });

		basketData.clearBasket();
		orderData.clearOrderData();
	} catch {
		console.error('Ошибка при оформлении заказа');
	}
});

// Обработчик события для успешного оформления заказа

events.on('success:open', ({ total }: { total: number }) => {
	const success = new Success(cloneTemplate(templates.success), {
		onClick: () => {
			modal.close();
		},
	});

	modal.render({
		content: success.render({
			total,
		}),
	});
});

// Загрузка данных при инициализации

loadCardsData();
