import { test } from '../../../support/env';

test.describe(
	'WCAG: arts page',
	{
		tag: '@a11y',
	},
	() => {
		test('Verify arts page is accessible', async ({ artsPage }) => {
			await artsPage.visit();
			await artsPage.verifyAccessibility();
		});
	}
);
