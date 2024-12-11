import { ICard } from '../../types';
import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IBasket {
	items: ICard[];
	price: number;
	selected: string[];
}

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this._price = ensureElement<HTMLElement>('.basket__price', container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

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

	set price(price: number) {
		this.setText(this._price, `${price} синапсов`);
	}

	set button(disabled: boolean) {
		this.setDisabled(this._button, disabled);
	}
}
