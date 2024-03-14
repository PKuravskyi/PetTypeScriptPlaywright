import { test } from '../../support/env';

test.describe('Checkout page', () => {
	test.beforeEach(
		async ({ signUpEndpoint, artsPage, basketPage, deliveryDetailsPage }) => {
			await artsPage.visit();
			await signUpEndpoint.signUpRandomUser();
			await artsPage.addArtToBasket('Mountain Landscape');
			await artsPage.addArtToBasket('Baby Zebra with butterfly');
			await artsPage.addArtToBasket('Astronaut dabbing');
			if (!artsPage.isDesktopViewport()) {
				await artsPage.openHamburgerMenu();
			}
			await artsPage.clickCheckout();
			await basketPage.clickContinueToCheckout();
			await deliveryDetailsPage.inputRandomFirstName();
			await deliveryDetailsPage.inputRandomLastName();
			await deliveryDetailsPage.inputRandomStreet();
			await deliveryDetailsPage.inputRandomPostCode();
			await deliveryDetailsPage.inputRandomCity();
			await deliveryDetailsPage.selectCountry('Ukraine');
		}
	);

	test('Verify user can fill out delivery details', async ({
		deliveryDetailsPage,
		paymentPage,
	}) => {
		await deliveryDetailsPage.clickContinueToPayment();
		await paymentPage.verifyURLMatchesPattern(/.*payment/);
	});

	test('Verify user can save delivery details address', async ({
		deliveryDetailsPage,
	}) => {
		await deliveryDetailsPage.clickSaveAddress();
		await deliveryDetailsPage.verifyNewlySavedAddress();
	});

	test('Verify user can get a discount', async ({
		deliveryDetailsPage,
		paymentPage,
	}) => {
		await deliveryDetailsPage.clickContinueToPayment();
		await paymentPage.inputDiscountCode();
		await paymentPage.clickSubmitDiscount();
		await paymentPage.verifyDiscountPrice();
	});

	test('Verify user can input credit card details and finish buying process', async ({
		deliveryDetailsPage,
		paymentPage,
		thankYouPage,
	}) => {
		await deliveryDetailsPage.clickContinueToPayment();
		await paymentPage.inputCreditCardOwner();
		await paymentPage.inputCreditCardNumber();
		await paymentPage.inputValidUntil();
		await paymentPage.inputCreditCardCVC();
		await paymentPage.clickPay();
		await thankYouPage.verifySuccessfullPaymentMessage();
	});
});
