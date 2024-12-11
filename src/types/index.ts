// Интерфейс для карточки товара
export interface ICard {
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
	id: string;
	index: string | null;
}

// Интерфейс каталога
export interface ICardsData {
	total: number;
	cards: ICard[];
	preview: ICard;
}

// Интерфейс корзины
export interface IBasketData {
	items: ICard[];
	total: number;
	price: number;
}

// Интерфейс для данных заказа
export interface IOrder {
	items: string[];
	payment: 'card' | 'cash' | null;
	address: string;
	email: string;
	phone: string;
	total: number;
}

// Интерфейс формы заказа
export type TOrderForm = Pick<IOrder, 'payment' | 'address'>;

// Интерфейс формы контактов
export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;

// Интерфейс методов запроса к серверу
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Интерфейс api
export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
