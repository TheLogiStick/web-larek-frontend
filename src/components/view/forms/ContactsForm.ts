import { TContactsForm } from '../../../types';
import { IEvents } from '../../base/events';
import { Form } from '../../view/Form';

export class ContactsForm extends Form<TContactsForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		this._phone = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
	}

	set email(value: string) {
		this._email.value = value;
	}

	set phone(value: string) {
		this._phone.value = value;
	}
}
