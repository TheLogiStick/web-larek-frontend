import { ICard } from '../../types';
import {
	createElement,
	ensureAllElements,
	ensureElement,
} from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IBasketView {
	items: ICard[];
	price: number;
	selected: string[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLElement;
	protected _indexes: HTMLElement[];

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;

		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this._price = ensureElement<HTMLElement>('.basket__price', container);
		this._button = ensureElement<HTMLElement>('.basket__button', container);
		this._indexes = ensureAllElements<any>('.basket__item-index', container);

		this.items = [];

		this._button.addEventListener('click', () => events.emit('basket:submit'));
	}

	set items(items: HTMLElement[]) {
		items.length
			? this._list.replaceChildren(...items)
			: this._list.replaceChildren(
					createElement<HTMLParagraphElement>('p', {
						textContent: 'Корзина пуста',
					})
			  );
	}

	set selected(items: string[]) {
		items.length
			? this.setDisabled(this._button, false)
			: this.setDisabled(this._button, true);
	}

	set price(price: number) {
		this.setText(this._price, `${price} синапсов`);
	}
}
