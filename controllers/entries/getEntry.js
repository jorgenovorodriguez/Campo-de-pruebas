const selectEntryByIdQuery = require('../../db/queries/entries/selectEntryByIdQuery');

const getEntry = async (req, res, next) => {
    try {
        const { entryId } = req.params;

        // Dado que la propiedad user puede no existir lo indicamos por medio de la interrogación.
        const entry = await selectEntryByIdQuery(entryId, req.user?.id);

        res.send({
            status: 'ok',
            data: {
                entry,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getEntry;
