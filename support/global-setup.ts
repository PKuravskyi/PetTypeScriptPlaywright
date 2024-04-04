import { emptyDir } from 'fs-extra';
import { join } from 'path';

async function emptyDirectory(dirName: string) {
	try {
		await emptyDir(join(__dirname, '../', dirName));
		console.log(`Successfully emptied '${dirName}' folder.`);
	} catch (error) {
		throw new Error(`Failed to empty '${dirName}' folder: ${error.message}`);
	}
}

async function globalSetup() {
	if (!process.env.CI) {
		await emptyDirectory('allure-results');
		await emptyDirectory('test-results');
	}
}

export default globalSetup;
