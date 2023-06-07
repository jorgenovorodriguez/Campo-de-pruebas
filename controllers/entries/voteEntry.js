const selectEntryByIdQuery = require('../../db/queries/entries/selectEntryByIdQuery');
const insertVoteQuery = require('../../db/queries/entries/insertVoteQuery');

const { generateError } = require('../../helpers');

const voteEntry = async (req, res, next) => {
    try {
        const { entryId } = req.params;

        const { value } = req.body;

        const entry = await selectEntryByIdQuery(entryId, req.user.id);

        // Si somos los dueños de la entrada lanzamos un error.
        if (entry.owner) {
            generateError('No puedes votar tu propia entrada', 403);
        }

        // Array con votos válidos.
        const validVotes = [1, 2, 3, 4, 5];

        // Si el voto no se encuentra en el array de votos válidos lanzamos un error.
        if (!validVotes.includes(value)) {
            generateError('Voto no válido', 400);
        }

        // Insertamos el voto.
        const votesAvg = await insertVoteQuery(value, entryId, req.user.id);

        res.send({
            status: 'ok',
            data: {
                entry: {
                    id: Number(entryId),
                    votes: Number(votesAvg),
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = voteEntry;
