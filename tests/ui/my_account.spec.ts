import { test } from '../../support/env';

test.describe('My account page', () => {
	test.beforeEach(async ({ artsPage }) => await artsPage.visit());

	test('Verify admin login via BE', async ({
		loginEndpoint,
		myAccountPage,
	}) => {
		await loginEndpoint.login();
		await myAccountPage.visit();
		await myAccountPage.verifyUserIsLoggedIn();
	});

	test('Verify admin login via BE with mocked request', async ({
		loginEndpoint,
		myAccountPage,
	}) => {
		await loginEndpoint.login(true);
		await myAccountPage.visit();
		await myAccountPage.verifyMockedErrorMessage();
	});
});
