// Интерфейс для карточки товара
export interface ICard {
	category: string;
	name: string;
	image: string;
	price: number;
	id: string;
}

// Интерфейс для превью карточки товара
export interface ICardPreview extends ICard {
	description: string;
}

// Интерфейс для карточки в корзине
export interface IBasketCard {
	id: string;
	name: string;
	price: string;
}

// Интерфейс для данных заказа
export interface IOrder {
	paymentMethod: 'Онлайн' | 'При получении';
	deliveryAddress: string | null;
	email: string | null;
	phone: string | null;
	totalPrice: number;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
