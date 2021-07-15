// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: 8080 });
const url = `http://localhost:8080/`;

console.log(`HTTP webserver running.  Access it at: ${url}`);

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
  // In order to not be blocking, we need to handle each connection individually
  // in its own async function.
  (async () => {
    // This "upgrades" a network connection into an HTTP connection.
    const httpConn = Deno.serveHttp(conn);
    // Each request sent over the HTTP connection will be yielded as an async
    // iterator from the HTTP connection.
    for await (const requestEvent of httpConn) {
        if (requestEvent.request.url == url) {
            // The native HTTP server uses the web standard `Request` and `Response`
            // objects.

            // Read the index.html file and serve it
            const html_file = await Deno.readFile('public/index.html');

            // create an decoder which decodes your html file to strings before sending
            // The requestEvent's `.respondWith()` method is how we send the response
            // back to the client.
            requestEvent.respondWith(
                new Response(html_file, {
                    status: 200,
                }),
            );
        }
        if (requestEvent.request.url == url + 'api/data') {
            console.log('hey I got your message!');
            const body = `Get your data shortly`;
            requestEvent.respondWith(
                new Response(body, {
                    status: 200,
                }),
            );
        }
    }
  })();
}
