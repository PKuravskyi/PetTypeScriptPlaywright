import { Page, Locator, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { BaseCheckoutPage } from './BaseCheckoutPage';

export class DeliveryDetailsPage extends BaseCheckoutPage {
	readonly firstNameInput: Locator;
	readonly lastNameInput: Locator;
	readonly streetInput: Locator;
	readonly postCodeInput: Locator;
	readonly cityInput: Locator;
	readonly countryDropdown: Locator;
	readonly saveAddressButton: Locator;
	readonly savedAddressSection: Locator;
	readonly savedAddressFirstNameLabel: Locator;
	readonly savedAddressLastNameLabel: Locator;
	readonly savedAddressStreetLabel: Locator;
	readonly savedAddressPostCodeLabel: Locator;
	readonly savedAddressCityLabel: Locator;
	readonly savedAddressCountryLabel: Locator;
	readonly continueToPaymentButton: Locator;

	constructor(page: Page) {
		super(page);
		this.firstNameInput = page.getByPlaceholder('First name');
		this.lastNameInput = page.getByPlaceholder('Last name');
		this.streetInput = page.getByPlaceholder('Street');
		this.postCodeInput = page.getByPlaceholder('Post code');
		this.cityInput = page.getByPlaceholder('City');
		this.countryDropdown = page.locator('.country-dropdown');
		this.saveAddressButton = page.locator('.save-address-button');
		this.savedAddressSection = page.locator('.saved-address-container');
		this.savedAddressFirstNameLabel = this.savedAddressSection.locator(
			'.saved-address-firstName'
		);
		this.savedAddressLastNameLabel = this.savedAddressSection.locator(
			'.saved-address-lastName'
		);
		this.savedAddressStreetLabel = this.savedAddressSection.locator(
			'.saved-address-street'
		);
		this.savedAddressPostCodeLabel = this.savedAddressSection.locator(
			'.saved-address-postcode'
		);
		this.savedAddressCityLabel = this.savedAddressSection.locator(
			'.saved-address-city'
		);
		this.savedAddressCountryLabel = this.savedAddressSection.locator(
			'.saved-address-country'
		);
		this.continueToPaymentButton = page.locator('.continue-to-payment-button');
	}

	async inputRandomFirstName(): Promise<void> {
		await this.firstNameInput.fill(faker.person.firstName());
	}

	async inputRandomLastName(): Promise<void> {
		await this.lastNameInput.fill(faker.person.lastName());
	}

	async inputRandomStreet(): Promise<void> {
		await this.streetInput.fill(faker.location.street());
	}

	async inputRandomPostCode(): Promise<void> {
		await this.postCodeInput.fill(faker.location.zipCode());
	}

	async inputRandomCity(): Promise<void> {
		await this.cityInput.fill(faker.location.city());
	}

	async selectCountry(country: string): Promise<void> {
		await this.countryDropdown.selectOption(country);
	}

	async clickSaveAddress(): Promise<void> {
		await this.saveAddressButton.click();
	}

	async clickContinueToPayment(): Promise<void> {
		await this.continueToPaymentButton.click();
	}

	async verifyNewlySavedAddress(): Promise<void> {
		expect(await this.savedAddressFirstNameLabel.first().innerText()).toBe(
			await this.firstNameInput.inputValue()
		);

		expect(await this.savedAddressLastNameLabel.first().innerText()).toBe(
			await this.lastNameInput.inputValue()
		);

		expect(await this.savedAddressStreetLabel.first().innerText()).toBe(
			await this.streetInput.inputValue()
		);

		expect(await this.savedAddressPostCodeLabel.first().innerText()).toBe(
			await this.postCodeInput.inputValue()
		);

		expect(await this.savedAddressCityLabel.first().innerText()).toBe(
			await this.cityInput.inputValue()
		);

		expect(await this.savedAddressCountryLabel.first().innerText()).toEqual(
			await this.countryDropdown.inputValue()
		);
	}
}
