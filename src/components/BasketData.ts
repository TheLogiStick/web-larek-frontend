import { ICard } from '../types';
import { IEvents } from './base/events';

interface IBasketData {
	items: ICard[];
	total: number;
	price: number;
}

export class BasketData implements IBasketData {
	protected _items: ICard[];
	protected _total: number;
	protected _price: number;

	constructor(protected events: IEvents) {
		this._items = [];
		this.events = events;
		this._total = 0;
		this._price = 0;
	}

	setItem(item: ICard) {
		this._items.push(item);
		this._total = this._items.length;
	}

	deleteItem(itemId: string) {
		const itemToDelete = this._items.find((item) => item.id === itemId);
		if (itemToDelete) {
			this.price = itemToDelete.price ? -itemToDelete.price : 0;
			this._items = this._items.filter((item) => item !== itemToDelete);
			this._total = this._items.length;
		}
	}

	checkItemInBasket(cardID: string) {
		return !!this._items.find((item) => item.id === cardID);
	}

	get items() {
		return this._items;
	}

	set total(total: number) {
		this._total = total;
	}

	get total() {
		return this._total;
	}

	set price(price: number) {
		this._price += price;
	}

	get price() {
		return this._price;
	}

	clearBasket() {
		this._items = [];
		this._total = 0;
		this._price = 0;

		this.events.emit('basket:change');
	}
}
