import { Page, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { BasePage } from './BasePage';

export class SignUpPage extends BasePage {
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly registerButton: Locator;

	constructor(page: Page) {
		super(page);
		this.emailInput = page.getByPlaceholder('E-Mail');
		this.passwordInput = page.getByPlaceholder('Password');
		this.registerButton = page.locator('//div[text()="Register"]');
	}

	async visit(): Promise<void> {
		await this.page.goto(this.baseUrl + 'signup');
	}

	async inputRandomEmail(): Promise<void> {
		await this.emailInput.fill(faker.internet.email());
	}

	async inputRandomPassword(): Promise<void> {
		await this.passwordInput.fill(faker.internet.password());
	}

	async clickRegister(): Promise<void> {
		await this.waitToClick(this.registerButton);
	}
}
