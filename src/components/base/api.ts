import { ApiPostMethods, IApi } from '../../types';

export class Api implements IApi {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	async handleResponse<T>(response: Response): Promise<T> {
		if (response.ok) return response.json();
		else throw new Error(await response.text());
	}

	async get<T>(uri: string) {
		const response = await fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		});
		return this.handleResponse<T>(response);
	}

	async post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
		const response = await fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		});
		return this.handleResponse<T>(response);
	}
}
