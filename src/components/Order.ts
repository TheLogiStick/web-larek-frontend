import { TFormOrder } from '../types';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class Order extends Form<TFormOrder> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._card = this.container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = this.container.elements.namedItem('cash') as HTMLButtonElement;
		this._address = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		this._card.addEventListener('click', () => (this.payment = 'card'));
		this._cash.addEventListener('click', () => (this.payment = 'cash'));
	}

	set payment(method: 'card' | 'cash') {
		if (method) this.onInputChange('payment', method);
		this.setDisabled(this._card, method === 'card');
		this.setDisabled(this._cash, method === 'cash');
	}

	set address(value: string) {
		this._address.value = value;
	}
}
