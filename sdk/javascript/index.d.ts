export interface Article {title: string; url: string; description: string; text: string; markdown: string}
export interface RequestOptions {query?: Record<string, unknown>; method?: string; body?: BodyInit | Record<string, unknown>; headers?: HeadersInit; check?: boolean; redirect?: RequestRedirect}
export class APIError extends Error {status: number; body: string}
export class CorsTools {
  constructor(options?: {baseUrl?: string; timeout?: number; fetch?: typeof globalThis.fetch});
  url(path: string, query?: Record<string, unknown>): string;
  request(path: string, options?: RequestOptions): Promise<Response>;
  proxy(url: string, options?: RequestOptions): Promise<Response>;
  read(url: string, options: {format: 'json'; render?: boolean; method?: 'GET' | 'POST'}): Promise<Article>;
  read(url: string, options?: {format?: 'markdown' | 'text'; render?: boolean; method?: 'GET' | 'POST'}): Promise<string>;
}
