import {CorsTools} from '../../sdk/javascript/index.js';
const client = new CorsTools();
console.log(await client.read('https://example.com/', {format: 'markdown'}));
