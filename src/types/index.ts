// Интерфейс для карточки товара
export interface ICard {
	category: string;
	name: string;
	image: string;
	price: number | null;
	id: string;
	description: string;
}

// Интерфейс корзины
export interface IBasket {
	cards: ICard[];
	totalPrice: number | null;
}

// Интерфейс для данных заказа
export interface IOrder {
	paymentMethod: 'Онлайн' | 'При получении';
	deliveryAddress: string | null;
	email: string | null;
	phone: string | null;
	totalPrice: number | null;
	lastTotalPrice: number | null;
	currentStep: number | null;
}

// Интерфейс формы заказа
export type TFormOrder = Pick<IOrder, 'paymentMethod' | 'deliveryAddress'>;

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
