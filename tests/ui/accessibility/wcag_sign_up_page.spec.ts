import { test } from '../../../support/env';

test.describe(
	'WCAG: sign up page',
	{
		tag: '@a11y',
	},
	() => {
		test('Verify sign up page accessibility', async ({ signUpPage }) => {
			await signUpPage.visit();
			await signUpPage.verifyAccessibility();
		});
	}
);
