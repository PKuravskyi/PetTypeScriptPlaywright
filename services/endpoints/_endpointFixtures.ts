import { test as baseTest } from '@playwright/test';
import { LoginEndpoint } from './LoginEndpoint';
import { SignUpEndpoint } from './SignUpEndpoint';

type Fixtures = {
	loginEndpoint: LoginEndpoint;
	signUpEndpoint: SignUpEndpoint;
};

export const test = baseTest.extend<Fixtures>({
	loginEndpoint: async ({ page }, use) => {
		await use(new LoginEndpoint(page));
	},

	signUpEndpoint: async ({ page }, use) => {
		await use(new SignUpEndpoint(page));
	},
});
