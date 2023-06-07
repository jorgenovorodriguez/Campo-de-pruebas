const getDB = require('../../getDB');

const insertEntryQuery = async (title, place, description, userId) => {
    let connection;

    try {
        connection = await getDB();

        const createdAt = new Date();

        // Insertamos la entrada.
        const [entry] = await connection.query(
            `INSERT INTO entries(title, place, description, userId, createdAt) VALUES(?, ?, ?, ?, ?)`,
            [title, place, description, userId, createdAt]
        );

        // Retornamos la entrada.
        return {
            id: entry.insertId,
            title,
            place,
            description,
            userId,
            createdAt,
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertEntryQuery;
