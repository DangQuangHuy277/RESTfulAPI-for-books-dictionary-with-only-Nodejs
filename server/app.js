const http = require("node:http");
const { getBooks, findById, postBook, updateBook, deleteBook } = require("./controller");

const host = "localhost";
const port = 8000;

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_NOT_FOUND = 404;
const CONTENT_TYPE_JSON = "application/json";

async function requestListener(req, res) {
    if (req.url.match(/\/api\/books\/([0-9]+)/) && req.method === "GET") {
        try {
            const id = req.url.split("/")[3].toString();
            const book = await findById(id);

            if (book) {
                res.writeHead(HTTP_STATUS_OK, { "Content-Type": CONTENT_TYPE_JSON });
                res.end(JSON.stringify(book));
            } else {
                throw new Error("Requested book does not exist");
            }
        } catch (error) {
            console.error(error);
            res.writeHead(HTTP_STATUS_NOT_FOUND, { "Content-Type": CONTENT_TYPE_JSON });
            res.end(JSON.stringify({ message: error.message }));
        }
    } else if (req.url === "/api/books" && req.method === "GET") {
        try {
            const books = await getBooks();

            res.writeHead(HTTP_STATUS_OK, { "Content-Type": CONTENT_TYPE_JSON });
            res.end(JSON.stringify(books));
        } catch (error) {
            console.error(error);
            res.writeHead(HTTP_STATUS_NOT_FOUND, { "Content-Type": CONTENT_TYPE_JSON });
            res.end(JSON.stringify({ message: error.message }));
        }
    } else if (req.url === "/api/books" && req.method === "POST") {
        try {
            let body = "";

            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", async () => {
                const book = JSON.parse(body);
                const newBook = await postBook(book);

                res.writeHead(HTTP_STATUS_CREATED, { "Content-Type": CONTENT_TYPE_JSON });
                res.end(JSON.stringify(newBook));
            });
        } catch (error) {
            console.error(error);
            res.writeHead(HTTP_STATUS_NOT_FOUND, { "Content-Type": CONTENT_TYPE_JSON });
            res.end(JSON.stringify({ message: error.message }));
        }
    } else if (req.url.match(/\/api\/books\/([0-9]+)/) && req.method === "PATCH") {
        try {
            const id = req.url.split("/")[3].toString();

            let body = "";

            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", async () => {
                const book = JSON.parse(body);
                const updatedBook = await updateBook(book, id);

                res.writeHead(HTTP_STATUS_OK, { "Content-Type": CONTENT_TYPE_JSON });
                res.end(JSON.stringify(updatedBook));
            });
        } catch (error) {
            console.error(error);
            res.writeHead(HTTP_STATUS_NOT_FOUND, { "Content-Type": CONTENT_TYPE_JSON });
            res.end(JSON.stringify({ message: error.message }));
        }
    } else if (req.url.match(/\/api\/books\/([0-9]+)/) && req.method === "DELETE") {
        try {
            const id = req.url.split("/")[3].toString();
            const deletedBook = await deleteBook(id);

            res.writeHead(HTTP_STATUS_OK, { "Content-Type": CONTENT_TYPE_JSON });
            res.end(JSON.stringify(deletedBook));
        } catch (error) {
            console.error(error);
            res.writeHead(HTTP_STATUS_NOT_FOUND, { "Content-Type": CONTENT_TYPE_JSON });
            res.end(JSON.stringify({ message: error.message }));
        }
    } else {
        res.writeHead(HTTP_STATUS_NOT_FOUND, { "Content-Type": CONTENT_TYPE_JSON });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
}

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});