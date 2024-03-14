import { test } from '../../support/env';

test.describe('Arts page', () => {
	test.beforeEach(async ({ artsPage }) => await artsPage.visit());

	test('Verify art can be added to basket', async ({ artsPage }) => {
		await artsPage.verifyBasketItemsCount(0);
		await artsPage.addArtToBasket('Mountain Landscape');
		await artsPage.verifyBasketItemsCount(1);
		await artsPage.addArtToBasket('Baby Zebra with butterfly');
		await artsPage.verifyBasketItemsCount(2);
	});

	test('Verify art can be removed from basket', async ({ artsPage }) => {
		await artsPage.addArtToBasket('Mountain Landscape');
		await artsPage.addArtToBasket('Young Man in hot air balloon');
		await artsPage.verifyBasketItemsCount(2);
		await artsPage.removeArtFromBasket('Mountain Landscape');
		await artsPage.verifyBasketItemsCount(1);
		await artsPage.removeArtFromBasket('Young Man in hot air balloon');
		await artsPage.verifyBasketItemsCount(0);
	});

	test('Verify arts can be sorted', async ({ artsPage }) => {
		await artsPage.sortBy('price-asc');
		await artsPage.verifyArtsSortedBy('price-asc');
		await artsPage.sortBy('price-desc');
		await artsPage.verifyArtsSortedBy('price-desc');
	});
});
