import 'dotenv/config';
import { mergeTests } from '@playwright/test';

import { test as pageFixtures } from '../pages/_pageFixtures';
import { test as endpointFixtures } from '../services/endpoints/_endpointFixtures';

export const test = mergeTests(pageFixtures, endpointFixtures);
