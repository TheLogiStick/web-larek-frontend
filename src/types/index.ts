// Интерфейс для карточки товара
export interface ICard {
	category: string;
	title: string;
	image: string;
	price: number | null;
	id: string;
	description: string;
	index: string | null;
}

// Интерфейс корзины
export interface IBasket {
	cards: ICard[];
	totalPrice: number | null;
}

// Интерфейс данных каталога
export interface ICatalogResponse {
	total: number;
	items: ICard[];
}

// Интерфейс каталога
export interface ICatalog {
	total: number;
	cards: ICard[];
	preview: ICard;
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
export type TFormOrder = Pick<IOrder, 'payment' | 'address'>;

// Интерфейс формы контактов
export type TFormContacts = Pick<IOrder, 'email' | 'phone'>;

// Интерфейс методов запроса к серверу
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Интерфейс api
export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
