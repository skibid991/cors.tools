from cors_tools import CorsTools

client = CorsTools()
print(client.read('https://example.com/', format='markdown'))
