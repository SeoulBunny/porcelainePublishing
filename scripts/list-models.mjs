import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

config({ path: path.join(projectRoot, '.env.local') });

const apiKey = process.env.GOOGLE_API_KEY;

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
);

const data = await response.json();
console.log(JSON.stringify(data, null, 2));
