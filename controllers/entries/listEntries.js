const selectAllEntriesQuery = require('../../db/queries/entries/selectAllEntriesQuery');

const listEntries = async (req, res, next) => {
    try {
        const { keyword } = req.query;

        // Dado que la propiedad user puede no existir lo indicamos por medio de la interrogación.
        const entries = await selectAllEntriesQuery(keyword, req.user?.id);

        res.send({
            status: 'ok',
            data: {
                entries,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = listEntries;
