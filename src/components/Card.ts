import { ICard } from '../types';
import { ensureElement, isEmpty } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected events: IEvents;
	protected cardId: string;
	protected cardTitle: HTMLElement;
	protected cardImage: HTMLImageElement;
	protected _cardDesc: HTMLElement;
	protected cardCategory: HTMLElement;
	protected cardPrice: HTMLElement;
	protected _cardButton: HTMLButtonElement;
	protected cardIndex: HTMLElement;

	constructor(
		protected template: HTMLButtonElement,
		events: IEvents,
		actions?: ICardActions
	) {
		super(template);
		this.events = events;

		this.cardTitle = ensureElement<HTMLElement>('.card__title', template);
		this._cardDesc = ensureElement<HTMLElement>('.card__text', template);
		this.cardCategory = ensureElement<HTMLElement>('.card__category', template);
		this.cardImage = ensureElement<HTMLImageElement>('.card__image', template);
		this.cardPrice = ensureElement<HTMLElement>('.card__price', template);
		this._cardButton = ensureElement<HTMLButtonElement>('button', template);
		this.cardIndex = ensureElement<HTMLElement>(
			'.basket__item-index',
			template
		);

		if (actions?.onClick) {
			if (this._cardButton) {
				this._cardButton.addEventListener('click', actions.onClick);
			} else {
				template.addEventListener('click', actions.onClick);
			}
		}
	}

	// setButtonHandler(eventName: string) {
	// 	this._cardButton.addEventListener('click', () => {
	// 		this.events.emit(`${eventName}`, { card: this });
	// 	});
	// }

	// setButtonText(text: string) {
	// 	this.setText(this._cardButton, text);
	// }

	set cardButton(text: string) {
		this.setText(this._cardButton, text);
	}

	set id(id: string) {
		this.cardId = id;
	}

	get id() {
		return this.cardId;
	}

	set title(title: string) {
		this.setText(this.cardTitle, title);
	}

	set description(desc: string) {
		this.setText(this._cardDesc, desc);
	}

	set category(category: string) {
		this.setText(this.cardCategory, category);
	}

	set image(value: string) {
		this.setImage(this.cardImage, value, this.title);
	}

	set price(price: string) {
		!isEmpty(price)
			? (this.cardPrice.textContent = `${price} синапсов`)
			: (this.cardPrice.textContent = 'бесценно');
	}

	set index(index: number) {
		this.setText(this.cardIndex, index);
	}
}
