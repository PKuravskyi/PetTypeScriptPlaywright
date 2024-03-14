import { Page } from '@playwright/test';
import { AxiosResponse } from 'axios';
import { BaseClientAPI } from './BaseClientAPI';

export class LoginEndpoint extends BaseClientAPI {
	readonly LOGIN_ENDPOINT = 'login';

	constructor(page: Page) {
		super(page);
	}

	async login(
		isWithMockedRequest: boolean = false
	): Promise<void | AxiosResponse<any, any>> {
		const payload = {
			username: process.env.ADMIN_USERNAME,
			password: process.env.ADMIN_PASSWORD,
		};

		if (isWithMockedRequest) {
			await this.page.route('**/api/user**', async route => {
				await route.fulfill({
					status: 500,
					contentType: 'application/json',
					body: JSON.stringify({ message: 'PLAYWRIGHT ERROR FROM MOCKING :)' }),
				});
			});
		}

		const response = await this.post(this.LOGIN_ENDPOINT, payload);

		if (response) {
			await this.page.evaluate(
				([tokenValue]) => {
					document.cookie = `token=${tokenValue}`;
				},
				[response.data.token]
			);
		}

		return response;
	}
}
