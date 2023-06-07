const getDB = require('../../getDB');

const { generateError } = require('../../../helpers');

const insertVoteQuery = async (value, entryId, userId) => {
    let connection;

    try {
        connection = await getDB();

        // Comprobamos si el usuario ya ha votado esta entrada.
        let [votes] = await connection.query(
            `SELECT id FROM entryVotes WHERE userId = ? AND entryId = ?`,
            [userId, entryId]
        );

        if (votes.length > 0) {
            generateError('Ya has votado esta entrada', 403);
        }

        // Insertamos el voto.
        await connection.query(
            `INSERT INTO entryVotes(value, entryId, userId, createdAt) VALUES(?, ?, ?, ?)`,
            [value, entryId, userId, new Date()]
        );

        // Obtenemos la media de votos.
        [votes] = await connection.query(
            `SELECT AVG(value) AS avg FROM entryVotes WHERE entryId = ?`,
            [entryId]
        );

        // Retornamos la media de votos de la entrada que acabamos de votar.
        return votes[0].avg;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertVoteQuery;
