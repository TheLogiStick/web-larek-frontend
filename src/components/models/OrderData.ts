import { IOrder } from '../../types';
import { IEvents } from '../base/events';

export class OrderData {
	protected _order: IOrder = {
		items: [],
		payment: null,
		address: '',
		email: '',
		phone: '',
		total: 0,
	};
	protected formErrors: Partial<Record<keyof IOrder, string>> = {};

	constructor(protected events: IEvents) {}

	get order() {
		return this._order;
	}

	getOrderField<K extends keyof IOrder>(field: K): IOrder[K] {
		return this._order[field];
	}

	setOrderField<K extends keyof IOrder>(field: K, value: IOrder[K]) {
		this._order[field] = value;
	}

	validate<K extends keyof IOrder>(
		field: K,
		errorMessage: string,
		formType: string
	) {
		const errors: typeof this.formErrors = { ...this.formErrors };

		if (!this._order[field]) {
			errors[field] = errorMessage;
		} else {
			delete errors[field];
		}

		this.formErrors = errors;
		this.events.emit(`${formType}:change`, errors);
		return !errors[field];
	}

	validateOrder() {
		const isPaymentValid = this.validate(
			'payment',
			'Необходимо выбрать способ оплаты',
			'formOrder'
		);
		const isAddressValid = this.validate(
			'address',
			'Необходимо ввести адрес',
			'formOrder'
		);
		return isPaymentValid && isAddressValid;
	}

	validateContacts() {
		const isEmailValid = this.validate(
			'email',
			'Необходимо ввести почту',
			'formContacts'
		);
		const isPhoneValid = this.validate(
			'phone',
			'Необходимо ввести номер телефона',
			'formContacts'
		);
		return isEmailValid && isPhoneValid;
	}

	clearOrderData() {
		this._order = {
			items: [],
			payment: null,
			address: '',
			email: '',
			phone: '',
			total: 0,
		};
	}
}
