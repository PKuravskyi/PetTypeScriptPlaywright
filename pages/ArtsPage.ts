import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArtsPage extends BasePage {
	readonly sortDropdown: Locator;
	readonly productCardSections: Locator;
	readonly artsPriceTextFields: Locator;

	constructor(page: Page) {
		super(page);
		this.sortDropdown = page.locator('.sort-dropdown');
		this.productCardSections = page.locator('[data-qa="product-card"]');
		this.artsPriceTextFields = page.locator('.product-price');
	}

	async visit(): Promise<void> {
		await this.page.goto(this.baseUrl);
	}

	async #artHandler(option: string, artName: string): Promise<void> {
		const basketBtn = this.page.locator(
			`//*[text()="${artName}"]/..//button/div`
		);
		await this.waitToClick(basketBtn);
		await expect(basketBtn).toHaveText(`${option} Basket`);
	}

	async #getArtPrice(elIdx: number): Promise<number> {
		return parseInt(await this.artsPriceTextFields.nth(elIdx).textContent());
	}

	async addArtToBasket(artName: string): Promise<void> {
		await this.#artHandler('Remove from', artName);
	}

	async removeArtFromBasket(artName: string): Promise<void> {
		await this.#artHandler('Add to', artName);
	}

	async sortBy(value: string): Promise<void> {
		await this.sortDropdown.selectOption({ value: value });
	}

	async verifyArtsSortedBy(sortType: string) {
		for (let i = 0; i < (await this.artsPriceTextFields.count()) - 1; i++) {
			switch (sortType) {
				case 'price-asc':
					expect(
						(await this.#getArtPrice(i)) <= (await this.#getArtPrice(i + 1))
					).toBeTruthy();
					break;
				case 'price-desc':
					expect(
						(await this.#getArtPrice(i)) >= (await this.#getArtPrice(i + 1))
					).toBeTruthy();
					break;
			}
		}
	}

	async verifyArtsPresence(): Promise<void> {
		await expect(this.productCardSections.nth(0)).toBeVisible();
	}
}
