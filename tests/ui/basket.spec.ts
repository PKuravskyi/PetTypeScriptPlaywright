import { test } from '../../support/env';

test.describe('Checkout page', () => {
	test.beforeEach(async ({ artsPage }) => await artsPage.visit());

	test('Verify arts can be removed from basket', async ({
		artsPage,
		basketPage,
	}) => {
		await artsPage.addArtToBasket('Mountain Landscape');
		await artsPage.addArtToBasket('Baby Zebra with butterfly');
		await artsPage.addArtToBasket('Astronaut dabbing');
		if (!artsPage.isDesktopViewport()) {
			await artsPage.openHamburgerMenu();
		}
		await artsPage.clickCheckout();
		await basketPage.removeCheapestArt();
		await basketPage.verifyBasketItemsCount(2);
		await basketPage.removeCheapestArt();
		await basketPage.verifyBasketItemsCount(1);
	});
});
