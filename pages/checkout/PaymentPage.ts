import { Page, Locator, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { BaseCheckoutPage } from './BaseCheckoutPage';

export class PaymentPage extends BaseCheckoutPage {
	readonly totalLabel: Locator;
	readonly totalIncludingDiscountLabel: Locator;
	readonly discountPercentageLabel: Locator;
	readonly discountCodeLabel: Locator;
	readonly discountCodeInput: Locator;
	readonly submitDiscountButton: Locator;
	readonly creditCardOwnerInput: Locator;
	readonly creditCardNumberInput: Locator;
	readonly validUntilInput: Locator;
	readonly creditCardCVCInput: Locator;
	readonly payButton: Locator;

	constructor(page: Page) {
		super(page);
		this.totalLabel = page.locator('.total-value');
		this.totalIncludingDiscountLabel = page.locator(
			'.total-with-discount-value'
		);
		this.discountPercentageLabel = page
			.frameLocator('.active-discount-container')
			.locator('//*[contains(text(),"Use the following code")]');
		this.discountCodeLabel = page
			.frameLocator('.active-discount-container')
			.locator('.discount-code');
		this.discountCodeInput = page.getByPlaceholder('Discount code');
		this.submitDiscountButton = page.locator('.submit-discount-button');

		this.creditCardOwnerInput = page.getByPlaceholder('Credit card owner');
		this.creditCardNumberInput = page.getByPlaceholder('Credit card number');
		this.validUntilInput = page.getByPlaceholder('Valid until');
		this.creditCardCVCInput = page.getByPlaceholder('Credit card CVC');
		this.payButton = page.locator('.pay-button');
	}

	async inputDiscountCode(): Promise<void> {
		await this.discountCodeInput.fill(await this.discountCodeLabel.innerText());
		await expect(this.discountCodeInput).toHaveValue(
			await this.discountCodeLabel.innerText()
		);
	}

	async clickSubmitDiscount(): Promise<void> {
		await this.submitDiscountButton.click();
	}

	async inputCreditCardOwner(): Promise<void> {
		await this.creditCardOwnerInput.fill(faker.person.fullName());
	}

	async inputCreditCardNumber(): Promise<void> {
		await this.creditCardNumberInput.fill(faker.finance.accountNumber(16));
	}

	async inputValidUntil(): Promise<void> {
		let randomMonthNum = faker.number.int({ min: 1, max: 12 });
		let randomMonth =
			randomMonthNum < 10 ? '0' + randomMonthNum : randomMonthNum;

		const randomYear = faker.number.int({
			min: new Date().getFullYear() % 100,
			max: 99,
		});

		await this.validUntilInput.fill(`${randomMonth}${randomYear}`);
	}

	async inputCreditCardCVC(): Promise<void> {
		await this.creditCardCVCInput.fill(faker.finance.creditCardCVV());
	}

	async clickPay(): Promise<void> {
		await this.payButton.click();
	}

	async verifyDiscountPrice(): Promise<void> {
		const totalAmount = +(await this.totalLabel.innerText()).replace('$', '');

		const discountPercentage = +(
			await this.discountPercentageLabel.innerText()
		).match(/\d+/);
		const discountAmount = (discountPercentage / 100) * totalAmount;
		const expectedPrice = Math.floor(totalAmount - discountAmount);

		expect(await this.totalIncludingDiscountLabel.innerText()).toBe(
			`${expectedPrice}$`
		);
	}
}
