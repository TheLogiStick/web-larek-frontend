import { ICard, ICatalog } from '../types';
import { IEvents } from './base/events';

export class CardData implements ICatalog {
	protected _cards: ICard[];
	protected _total: number;
	preview: ICard;

	constructor(protected events: IEvents) {}

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

	get total() {
		return this._total;
	}

	getCard(cardId: string) {
		return this._cards.find((item) => item.id === cardId);
	}

	setPreview(card: ICard) {
		this.preview = card;
		this.events.emit('preview:change', this.preview);
	}
}
