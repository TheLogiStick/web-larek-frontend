import { ICard, IOrder } from '../types';
import { Api } from './base/api';

type cardListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface IOrderResult {
	id: string;
	total: number;
}

export class AppApi extends Api {
	constructor(readonly cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	async fetchCardsData(): Promise<cardListResponse<ICard>> {
		const data: cardListResponse<ICard> = await this.get('/product');

		data.items = data.items.map((item) => ({
			...item,
			image: this.cdn + item.image,
		}));

		return data;
	}

	async sendOrder(order: IOrder): Promise<IOrderResult> {
		return await this.post('/order', order);
	}
}
