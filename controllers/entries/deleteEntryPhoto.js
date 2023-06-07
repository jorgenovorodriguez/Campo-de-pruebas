const selectEntryByIdQuery = require('../../db/queries/entries/selectEntryByIdQuery');
const deletePhotoQuery = require('../../db/queries/entries/deletePhotoQuery');

const { generateError, deletePhoto } = require('../../helpers');

const deleteEntryPhoto = async (req, res, next) => {
    try {
        const { entryId, photoId } = req.params;

        const entry = await selectEntryByIdQuery(entryId, req.user.id);

        // Si no somos los dueños de la entrada lanzamos un error.
        if (!entry.owner) {
            generateError('No tienes suficientes permisos', 401);
        }

        // Localizamos la foto en el array de fotos de la entrada.
        const photo = entry.photos.find(
            (photo) => photo.id === Number(photoId)
        );

        // Si no hay foto lanzamos un error.
        if (!photo) {
            generateError('Foto no encontrada', 404);
        }

        // Borramos la foto de la carpeta uploads.
        await deletePhoto(photo.name);

        // Borramos la foto en la base de datos.
        await deletePhotoQuery(photoId);

        res.send({
            status: 'ok',
            message: 'Foto eliminada',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = deleteEntryPhoto;
