import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
	readonly page: Page;
	readonly baseUrl: string = 'http://localhost:2221/';
	readonly hamburgerMenuButton: Locator;
	readonly checkoutButton: Locator;
	readonly basketCounterTextField: Locator;

	constructor(page: Page) {
		this.page = page;
		this.hamburgerMenuButton = page.locator('.burger-button');
		this.checkoutButton = page.getByRole('link', { name: 'Checkout' });
		this.basketCounterTextField = page.locator(
			'[data-qa="header-basket-count"]'
		);
	}

	isDesktopViewport(): Boolean {
		return this.page.viewportSize().width >= 600;
	}

	async getBasketItemsCount(): Promise<number> {
		return +(await this.basketCounterTextField.textContent());
	}

	async clickCheckout(): Promise<void> {
		this.waitToClick(this.checkoutButton);
	}

	async openHamburgerMenu(): Promise<void> {
		this.waitToClick(this.hamburgerMenuButton);
	}

	async waitToClick(element: Locator): Promise<void> {
		await element.waitFor();
		await element.click();
	}

	async verifyURLMatchesPattern(url: RegExp): Promise<void> {
		await expect(this.page).toHaveURL(url);
	}

	async verifyBasketItemsCount(count: number): Promise<void> {
		expect(await this.getBasketItemsCount()).toEqual(count);
	}
}
