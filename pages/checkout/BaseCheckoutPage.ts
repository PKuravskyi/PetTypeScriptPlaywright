import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BaseCheckoutPage extends BasePage {
	constructor(page: Page) {
		super(page);
	}
}
