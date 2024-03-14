import { Page } from '@playwright/test';
import axios, { AxiosError } from 'axios';

export class BaseClientAPI {
	readonly page: Page;
	readonly baseApiUrl: string;

	constructor(page: Page) {
		this.page = page;
		this.baseApiUrl = 'http://localhost:2221/api/';
	}

	async post(endpoint: string, payload: object) {
		const response = await axios
			.post(this.baseApiUrl + endpoint, payload)
			.catch(error => {
				this.#printErrorMessage(error);
			});
		return response;
	}

	async #printErrorMessage(error: AxiosError<any>) {
		const message = `${error.message}\nResponse details: ${error.response.statusText} - ${error.response.data}`;
		throw new Error(message);
	}
}
