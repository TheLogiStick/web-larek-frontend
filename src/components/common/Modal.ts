import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	protected _escKeyListener: (event: KeyboardEvent) => void;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._escKeyListener = (event) => {
			if (event.key === 'Escape') this.close();
		};

		this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement | null) {
		if (value) this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		document.addEventListener('keydown', this._escKeyListener);
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		document.removeEventListener('keydown', this._escKeyListener);
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
