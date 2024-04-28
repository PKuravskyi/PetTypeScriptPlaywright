import { test } from '../../../support/env';

test.describe(
	'WCAG: basket page',
	{
		tag: '@a11y',
	},
	() => {
		test('Verify basket page accessibility', async ({
			artsPage,
			basketPage,
		}) => {
			await artsPage.visit();
			await artsPage.addArtToBasket('Mountain Landscape');
			if (!artsPage.isDesktopViewport()) {
				await artsPage.openHamburgerMenu();
			}
			await artsPage.clickCheckout();
			await basketPage.verifyBasketItemsCount(1);
			await basketPage.verifyAccessibility();
		});
	}
);
