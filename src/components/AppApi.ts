import { ICard, IOrder } from '../types';
import { Api } from './base/api';

export type TCardListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface IOrderResponse {
	id: string;
	total: number;
}

export class AppApi extends Api {
	constructor(
		readonly cdn: string,
		readonly baseUrl: string,
		options?: RequestInit
	) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	async fetchCardsData(): Promise<TCardListResponse<ICard>> {
		const data: TCardListResponse<ICard> = await this.get('/product');

		data.items = data.items.map((item) => ({
			...item,
			image: this.cdn + item.image,
		}));

		return data;
	}

	async sendOrder(order: IOrder): Promise<IOrderResponse> {
		return await this.post('/order', order);
	}
}
