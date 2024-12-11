import { ICard } from '../types';
import { ensureElement, isEmpty } from '../utils/utils';
import { Component } from './base/Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected _id: string;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _index: HTMLElement;

	constructor(protected container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._description = ensureElement<HTMLElement>('.card__text', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = ensureElement<HTMLButtonElement>('button', container);
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set buttonText(text: string) {
		this.setText(this._button, text);
	}

	set buttonState(disabled: boolean) {
		this.setDisabled(this._button, disabled);
	}

	set id(id: string) {
		this._id = id;
	}

	get id() {
		return this._id;
	}

	set title(title: string) {
		this.setText(this._title, title);
	}

	set description(desc: string) {
		this.setText(this._description, desc);
	}

	set category(category: string) {
		this.setText(this._category, category);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(price: string) {
		!isEmpty(price)
			? (this._price.textContent = `${price} синапсов`)
			: (this._price.textContent = 'бесценно');
	}

	set index(index: number) {
		this.setText(this._index, index);
	}
}
