import { ICard, ICatalog } from '../types';
import { IEvents } from './base/events';

// export interface IItem {
// 	category: string;
// 	description: string;
// 	id: string;
// 	image: string;
// 	price: number | null;
// 	title: string;
// }

export class CardData implements ICatalog {
	protected _cards: ICard[];
	protected events: IEvents;
	protected _total: number;

	constructor(events: IEvents) {
		this.events = events;
	}

	set cards(items: ICard[]) {
		this._cards = items;
		this.events.emit('cards:changed');
	}

	get cards() {
		return this._cards;
	}

	set total(total: number) {
		this._total = total;
	}

	getCard(cardId: string) {
		return this._cards.find((item) => item.id === cardId);
	}
}
