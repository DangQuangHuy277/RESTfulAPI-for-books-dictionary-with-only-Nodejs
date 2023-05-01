const { pool } = require("./db");

const getBooks = async function () {
    try {
        const res = await pool.query("SELECT * FROM books");
        return res.rows;
    } catch (error) {
        throw new Error(`Error in getBooks function: ${error.message}`);
    }
};

const findById = async function (id) {
    if (!id) {
        throw new Error("id parameter is required for findById function");
    }

    if (typeof id !== "string") {
        throw new Error("id parameter must be a string");
    }

    try {
        const res = await pool.query(`SELECT * FROM books WHERE isbn = $1`, [
            id,
        ]);

        if (res.rowCount === 0) {
            throw new Error(`No book found with isbn  = ${id}`);
        }

        return res.rows[0];
    } catch (error) {
        throw new Error(`Error in findById function: ${error.message}`);
    }
};

const postBook = async function (book) {
    if (!book) {
        throw new Error("book parameter is required for postBook function");
    }

    try {
        const res = await pool.query(
            `INSERT INTO books VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                book.isbn,
                book.name,
                book.author,
                book.pages,
                book.published,
                book.publisher,
                book.format,
                book.languge,
            ]
        );

        return res.rows[0];
    } catch (error) {
        throw new Error(`Error in postBook function: ${error.message}`);
    }
};

const updateBook = async function (fieldsToUpdate, id) {
    if (!fieldsToUpdate || !id) {
        throw new Error("fieldsToUpdate and id parameters are required for updateBook function");
    }

    try {
        const updateFields = Object.keys(fieldsToUpdate)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(", ");
        console.log(id)
        console.log(typeof(id))
        const values = Object.values(fieldsToUpdate);
        const query = {
            text: `UPDATE books SET ${updateFields} WHERE isbn = $${values.length + 1}`,
            values: [...values, id],
        };

        const res = await pool.query(query);

        if (res.rowCount === 0) {
            throw new Error(`No book found with isbn ${id}`);
        }

        return res.rows[0];
    } catch (error) {
        throw new Error(`Error in updateBook function: ${error.message}`);
    }
};

const deleteBook = async function (id) {
    try {
        const delBook = await findById(id);

        if (delBook.length === 0) {
            throw new Error(`No book found with isbn ${id}`);
        }

        const res = await pool.query(`DELETE FROM books WHERE isbn = $1`, [id]);
        return res.rows[0];
    } catch (error) {
        throw new Error(`Error in deleteBook function: ${error.message}`);
    }
};

module.exports = { getBooks, findById, postBook, updateBook, deleteBook };
