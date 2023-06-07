const insertPhotoQuery = require('../../db/queries/entries/insertPhotoQuery');
const selectEntryByIdQuery = require('../../db/queries/entries/selectEntryByIdQuery');

const { generateError, savePhoto } = require('../../helpers');

const addEntryPhoto = async (req, res, next) => {
    try {
        const { entryId } = req.params;

        // Si no hay foto lanzamos un error.
        if (!req.files?.photo) {
            generateError('Faltan campos', 400);
        }

        const entry = await selectEntryByIdQuery(entryId, req.user.id);

        // Si no somos los dueños de la entrada lanzamos un error.
        if (!entry.owner) {
            generateError('No tienes suficientes permisos', 401);
        }

        // Si la entrada ya tiene tres fotos lanzamos un error.
        if (entry.photos.length > 2) {
            generateError('Límite de tres fotos alcanzado', 403);
        }

        // Guardamos la foto en la carpeta uploads y obtenemos el nombre que le hemos dado.
        const photoName = await savePhoto(req.files.photo, 500);

        // Guardamos la foto en la base de datos.
        const photo = await insertPhotoQuery(photoName, entryId);

        res.send({
            status: 'ok',
            data: {
                photo: {
                    ...photo,
                    entryId: Number(entryId),
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = addEntryPhoto;
