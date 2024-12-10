import { IOrder } from '../types';
import { IEvents } from './base/events';

interface IAppState {
	order: IOrder;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export class OrderData implements IAppState {
	private _order: IOrder = {
		items: [],
		payment: null,
		address: '',
		email: '',
		phone: '',
		totalPrice: 0,
		lastTotalPrice: 0,
		currentStep: 0,
	};
	private formErrors: FormErrors = {};

	constructor(protected events: IEvents) {}

	// Геттер для полного объекта order
	get order(): IOrder {
		return this._order;
	}

	getOrderField<K extends keyof IOrder>(field: K): IOrder[K] {
		return this._order[field];
	}

	setOrderField<K extends keyof IOrder>(field: K, value: IOrder[K]): void {
		this._order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:valid', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment)
			errors.payment = 'Необходимо выбрать способ оплаты';
		if (!this.order.address) errors.address = 'Необходимо указать адресс';

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
