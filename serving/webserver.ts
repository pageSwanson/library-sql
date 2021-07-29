import { DB } from "https://deno.land/x/sqlite/mod.ts";

// open the database file
const db = new DB("sqlite.db");

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
        // hanlde the basic request for loading the index
        if (requestEvent.request.url == url) {
            // The native HTTP server uses the web standard `Request` and `Response`
            // objects.

            // Read the index.html file
            const index_content = await Deno.readFile(`public/index.html`);

            // ...  and serve it!
            // The requestEvent's `.respondWith()` method is how we send the response
            // back to the client.
            requestEvent.respondWith(
                new Response(index_content, {
                    status: 200,
                }),
            );
            continue;
        }
        // if the request is to a url that matches 'http://localhost:8080/api/data'
        // the following code will execute
        if (requestEvent.request.url == url + `api/data`) {
            // add a console entry to debug
            console.log(`You requested data`);

            // determine how our data should look
            // we can store what we like within a structure
            // the following defines a list of 'strings'
            const data: Array<string> = [];

            // read this as 'for every row that we select with our query'
            for (
                const [color, material, volume, manufactured_where] of
                db.query(`SELECT color, material, volume_milliliters, manufactured_where FROM bottle_info`)
            ) {
                console.log(color as string, material as string, volume as number, manufactured_where as string);
                // add the items from the row as one long string
                data.push(
                    `color: ${color}, material: ${material}, volume: ${volume}, manufactured_where: ${manufactured_where}`
                );
            }

            // respond to the request with the requested data
            // now our body contains real content
            requestEvent.respondWith(
                // we expect a string - so create a string from the list
                // separate each item onto a separate line
                new Response(data.join(`\n`), {
                    status: 200,
                }),
            );
            continue;
        }
    }
  })();
}

db.close();
