import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BasketPage extends BasePage {
	readonly basketCardSections: Locator;
	readonly basketCardRemoveItemButtons: Locator;
	readonly continueToCheckoutButton: Locator;

	constructor(page: Page) {
		super(page);
		this.basketCardSections = page.locator('[data-qa="basket-card"]');
		this.basketCardRemoveItemButtons = page.locator('.basket-card-remove-item');
		this.continueToCheckoutButton = page.locator('.continue-to-checkout');
	}

	async removeCheapestArt(): Promise<void> {
		const artsPrices = [];

		for (const card of await this.basketCardSections.all()) {
			const cardPrice = await card.locator('.basket-item-price').textContent();
			artsPrices.push(+cardPrice.replace('$', ''));
		}

		const cheapestPriceIdx = artsPrices.indexOf(Math.min(...artsPrices));
		await this.waitToClick(
			this.basketCardRemoveItemButtons.nth(cheapestPriceIdx)
		);
		await this.page.waitForTimeout(500);
	}

	async clickContinueToCheckout(): Promise<void> {
		await this.waitToClick(this.continueToCheckoutButton);
	}
}
