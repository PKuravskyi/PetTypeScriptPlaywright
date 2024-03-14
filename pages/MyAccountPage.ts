import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyAccountPage extends BasePage {
	readonly errorMessageTextField: Locator;

	constructor(page: Page) {
		super(page);
		this.errorMessageTextField = page.locator('.error-message');
	}

	async visit(): Promise<void> {
		await this.page.goto(this.baseUrl + 'my-account');
	}

	async verifyUserIsLoggedIn(user: string = ''): Promise<void> {
		const username = user ? user : process.env.ADMIN_USERNAME;

		await expect(this.page.locator(`//*[text()='${username}']`)).toBeVisible();
	}

	async verifyMockedErrorMessage(): Promise<void> {
		await expect(this.errorMessageTextField).toHaveText(
			'PLAYWRIGHT ERROR FROM MOCKING :)'
		);
	}
}
