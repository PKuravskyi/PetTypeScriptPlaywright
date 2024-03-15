import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
	readonly registerButton: Locator;

	constructor(page: Page) {
		super(page);
		this.registerButton = page.locator('.go-to-signup-button');
	}

	async clickRegister(): Promise<void> {
		await this.waitToClick(this.registerButton);
	}
}
