import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set default environment for tests
process.env['NODE_ENV'] = 'test';
process.env.GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || 'test-api-key';

// Any global setup can go here
