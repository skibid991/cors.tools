import {CorsTools} from '../../sdk/javascript/index.js';
const client = new CorsTools();
const article = await client.read('https://example.com/', {format: 'json', render: true});
console.log(article.title, article.markdown);
const response = await client.proxy('https://example.com/');
console.log(response.status, response.headers.get('content-type'));
