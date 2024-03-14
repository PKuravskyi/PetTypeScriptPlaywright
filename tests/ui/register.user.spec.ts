import { test } from '../../support/env';

test.describe('Sign up page', () => {
	test.beforeEach(async ({ signUpPage }) => await signUpPage.visit());

	test('Verify new user can be registered via UI', async ({
		signUpPage,
		artsPage,
	}) => {
		await signUpPage.inputRandomEmail();
		await signUpPage.inputRandomPassword();
		await signUpPage.clickRegister();
		await artsPage.verifyArtsPresence();
	});

	test('Verify new user can be registered via BE', async ({
		signUpEndpoint,
		myAccountPage,
	}) => {
		const { payload } = await signUpEndpoint.signUpRandomUser();
		await myAccountPage.visit();
		await myAccountPage.verifyUserIsLoggedIn(payload.username);
	});
});
