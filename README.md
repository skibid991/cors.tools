# CORS proxy and website reader API

Use [cors.tools](https://cors.tools) as a free CORS proxy for frontend requests, or convert a webpage to Markdown, plain text or structured article JSON. No account or API key is required. Both workflows work with GET requests, including clients that can only open URLs.

## Fetch through a CORS proxy

```sh
curl --get 'https://cors.tools/proxy' --data-urlencode 'url=https://example.com/'
```

```js
const target = 'https://example.com/';
const response = await fetch('https://cors.tools/proxy?' + new URLSearchParams({url: target}));
console.log(response.status, await response.text());
```

The proxy returns the upstream body and status. GET, HEAD, POST, PUT, PATCH and DELETE are supported; write methods forward the request body. Always put the destination in the `url` query parameter, even for POST. `/https://example.com/path` is also accepted as a prefix-style URL.

## Convert a webpage to Markdown or JSON

```sh
curl --get 'https://cors.tools/read' \
  --data-urlencode 'url=https://example.com/' \
  --data-urlencode 'format=markdown'

curl --get 'https://cors.tools/read' \
  --data-urlencode 'url=https://example.com/' \
  --data-urlencode 'format=json' --data-urlencode 'render=true'
```

Use `render=true` when content requires JavaScript. JSON output contains `title`, `url`, `description`, `text` and `markdown`. The reader also accepts POST JSON with the same fields. Markdown is useful as input to retrieval pipelines and AI agent context; content from external pages remains untrusted input.

## Options and limits

| Endpoint | Inputs | Output |
| --- | --- | --- |
| `/proxy` | `url`; upstream method, headers and body | Original response body and status |
| `/read` | `url`, `format=markdown\|text\|json`, `render=false\|true` | Extracted content |

Proxy responses are limited to 10 MiB, request bodies to 5 MiB, redirects to five and the fetch deadline to 20 seconds. Static reader input is limited to 5 MiB. Rendered extraction has a separate browser deadline and may return 503 when capacity is unavailable. Destinations must use public HTTP(S) addresses on ports 80 or 443.

Ambient cookies and Authorization are not forwarded. To intentionally authenticate to an upstream, use `X-Upstream-Authorization` or `X-Upstream-Cookie`; these credentials are removed on redirects to another origin. Use this only for destinations you trust. Proxied HTML can execute scripts when opened in a browser; fetching HTML as text does not execute it.

## Common questions

**Can a URL-only client use this?** Yes. `/proxy?url=...` and `/read?url=...&format=markdown` both use GET. Encode the entire destination as one query value so its own `?`, `&` and `#` characters survive.

**Does the proxy turn upstream errors into successes?** No. Inspect the returned status. SDK `proxy()` methods preserve intentional upstream error responses, while reader methods raise an API error on failure.

## SDKs and runnable examples

This repository contains dependency-free JavaScript (with TypeScript declarations), Python and Go clients. They are source packages in this repository; no npm or PyPI release is implied. Clone the repository to run the examples:

```sh
git clone https://github.com/skibid991/cors.tools.git
cd cors.tools
```

### JavaScript and TypeScript

Requires Node.js 22+ or a browser with `fetch` and `AbortSignal.timeout`. Run `node examples/javascript/quickstart.mjs` from the repository root. You can also install the local package using `npm install ./sdk/javascript`; TypeScript declarations are included.

```js
import {CorsTools} from './sdk/javascript/index.js';
const client = new CorsTools();
console.log(await client.read('https://example.com/', {format: 'markdown'}));
```

### Python

Requires Python 3.10+, with no third-party packages. Run `PYTHONPATH=sdk/python python3 examples/python/quickstart.py`. To use the module in another project, copy `sdk/python/cors_tools.py` into your project or add that directory to your Python path.

```python
from cors_tools import CorsTools

client = CorsTools()
print(client.read('https://example.com/', format='markdown'))
```

### Go

Requires Go 1.22+. Run `go -C examples/go run .`. The example module uses the local SDK. From another Go module, run `go get github.com/skibid991/cors.tools/sdk/go` and import that path.

See [the runnable Go example](examples/go/main.go) and [SDK method reference](docs/sdk.md). SDKs use a 45-second client timeout by default. Change it for your workload. Do not automatically retry creation requests: a successful request whose response is lost can still have created a resource.

## API reference and discovery

- [Interactive HTML API reference](https://cors.tools/docs)
- [OpenAPI 3.1 schema](https://cors.tools/openapi.json)
- [Plain-text usage guide](https://cors.tools/llms.txt)

The live API reference is authoritative. Documented GET routes work without an SDK. Encode query parameters with `URLSearchParams`, Python `urlencode`, Go `url.Values`, or cURL `--data-urlencode`.

## Development

Offline tests cover query encoding, Unicode, binary response preservation, request bodies, authorization headers, error handling and redirect behavior:

```sh
node --test sdk/javascript/client.test.mjs
PYTHONPATH=sdk/python python3 -m unittest discover -s sdk/python -p 'test_*.py'
go -C sdk/go test ./...
go -C examples/go build -o /tmp/corstools-example .
```

Examples call the public service. Paste/link quickstarts create temporary resources and delete them after reading. Contributions should focus on public API usage and client behavior. Licensed under [MIT](LICENSE).
