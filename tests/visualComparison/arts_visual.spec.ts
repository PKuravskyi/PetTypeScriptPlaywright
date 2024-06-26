import { test } from '../../support/env';

test.describe(
	'Arts page visual comparison',
	{
		tag: '@vc',
	},
	() => {
		test.beforeEach(async ({ artsPage }) => await artsPage.visit());

		test('Verify arts page visualisation (default sorting)', async ({
			artsPage,
		}) => {
			await artsPage.verifyPageHasScreenshot();
		});

		test('Verify arts page visualisation (ascending sorting)', async ({
			artsPage,
		}) => {
			await artsPage.sortBy('price-asc');
			await artsPage.verifyPageHasScreenshot();
		});

		test('Verify arts page visualisation (descending sorting)', async ({
			artsPage,
		}) => {
			await artsPage.sortBy('price-desc');
			await artsPage.verifyPageHasScreenshot();
		});
	}
);
