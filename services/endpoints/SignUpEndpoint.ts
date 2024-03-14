import { Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { BaseClientAPI } from './BaseClientAPI';

export class SignUpEndpoint extends BaseClientAPI {
	readonly SIGNUP_ENDPOINT = 'signup';

	constructor(page: Page) {
		super(page);
	}

	async signUpRandomUser() {
		const payload = {
			username: 'auto_member_' + faker.number.int(),
			password: faker.internet.password(),
		};

		const response = await this.post(this.SIGNUP_ENDPOINT, payload);

		if (response) {
			await this.page.evaluate(
				([tokenValue]) => {
					document.cookie = `token=${tokenValue}`;
				},
				[response.data.token]
			);
			return { response, payload };
		}
	}
}
