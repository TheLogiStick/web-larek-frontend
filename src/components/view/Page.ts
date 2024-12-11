import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _counter: HTMLElement;
	protected _openBasketButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._openBasketButton =
			ensureElement<HTMLButtonElement>('.header__basket');

		this._openBasketButton.addEventListener('click', () =>
			events.emit('basket:open')
		);
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(isLocked: boolean) {
		isLocked
			? this._wrapper.classList.add('page__wrapper_locked')
			: this._wrapper.classList.remove('page__wrapper_locked');
	}

	set counter(value: number) {
		this.setText(this._counter, value);
	}
}
