const getDB = require('../../getDB');

const { generateError } = require('../../../helpers');

const selectEntryByIdQuery = async (entryId, userId = 0) => {
    let connection;

    try {
        connection = await getDB();

        const [entries] = await connection.query(
            `
                SELECT
                    E.id,
                    E.title,
                    E.place,
                    E.description,
                    U.username,
                    E.userId,
                    E.userId = ? AS owner,
                    AVG(IFNULL(V.value, 0)) AS votes,
                    E.createdAt
                FROM entries E
                INNER JOIN users U ON U.id = E.userId
                LEFT JOIN entryVotes V ON E.id = V.entryId
                WHERE E.id = ?
                GROUP BY E.id
                ORDER BY E.createdAt DESC
            `,
            [userId, entryId]
        );

        // Si no hay entradas lanzamos un error.
        if (entries.length < 1) {
            generateError('Entrada no encontrada', 404);
        }

        // Llegados a este punto sabemos que existe una entrada y que está en la
        // posición 0 del array. Vamos a obtener las fotos de dicha entrada (si tiene).
        const [photos] = await connection.query(
            `SELECT id, name FROM entryPhotos WHERE entryId = ?`,
            [entries[0].id]
        );

        // Convertimos a Number la media de votos.
        entries[0].votes = Number(entries[0].votes);

        // Devolvemos los datos de la entrada junto a sus fotos.
        return {
            ...entries[0],
            photos,
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectEntryByIdQuery;
