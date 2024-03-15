import { emptyDir } from 'fs-extra';
import { join } from 'path';

async function globalSetup() {
	// Clean allure-results folder before each test run
	try {
		await emptyDir(join(__dirname, '../allure-results'));
		console.log('Successfully removed allure results folder.');
	} catch (error) {
		console.error('Error cleaning allure results folder:', error);
	}
}

export default globalSetup;
