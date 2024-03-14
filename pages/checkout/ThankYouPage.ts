import { Page, Locator, expect } from '@playwright/test';
import { BaseCheckoutPage } from './BaseCheckoutPage';

export class ThankYouPage extends BaseCheckoutPage {
	readonly thankYouLabel: Locator;

	constructor(page: Page) {
		super(page);

		this.thankYouLabel = page.getByRole('heading', {
			name: 'Thank you for shopping with us!',
		});
	}

	async verifySuccessfullPaymentMessage() {
		await expect(this.thankYouLabel).toBeVisible();
	}
}
