require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const cors = require('cors');

// Creamos el servidor.
const app = express();

// Middleware que deserializa un body en formato raw creando la propiedad body
// en el objeto request.
app.use(express.json());

// Middleware que deserializa un body en formato form-data creando la propiedad body
// en el objeto request y, si hay algún archivo, la propiedad files.
app.use(fileUpload());

// Middleware que muestra información sobre la petición entrante.
app.use(morgan('dev'));

// Middleware que evita problemas con las CORS cuando intentamos conectar el cliente con
// el servidor.
app.use(cors());

// Middleware que indica al servidor cuál es el directorio de ficheros estáticos.
app.use(express.static(process.env.UPLOADS_DIR));

/**
 * ################################
 * ## Middlewares personalizados ##
 * ################################
 *
 * La carpeta middlewares contiene funciones controladoras intermedias.
 *
 */

const authUser = require('./middlewares/authUser');
const authUserOptional = require('./middlewares/authUserOptional');
const userExists = require('./middlewares/userExists');

/**
 * ##########################
 * ## Middlewares usuarios ##
 * ##########################
 */

const {
    newUser,
    validateUser,
    loginUser,
    getUser,
    getOwnUser,
    sendRecoverPass,
    editUserPass,
    editUserAvatar,
} = require('./controllers/users');

// Registro de usuario pendiente de validar.
app.post('/users', newUser);

// Validar usuario con código de registro.
app.put('/users/validate/:regCode', validateUser);

// Login de usuario.
app.post('/users/login', loginUser);

// Obtener información del perfil de un usuario.
app.get('/users/:userId', getUser);

// Obtener información del usuario del token (nuestro usuario).
app.get('/users', authUser, userExists, getOwnUser);

// Enviar al usuario un email de recuperación de contraseña.
app.put('/users/password/recover', sendRecoverPass);

// Cambiar la contraseña de usuario con un código de recuperación dado.
app.put('/users/password', editUserPass);

// Editar avatar de usuario.
app.put('/users/avatar', authUser, userExists, editUserAvatar);

/**
 * ##########################
 * ## Middlewares entradas ##
 * ##########################
 */

const {
    newEntry,
    listEntries,
    getEntry,
    voteEntry,
    addEntryPhoto,
    deleteEntryPhoto,
} = require('./controllers/entries');

// Nueva entrada.
app.post('/entries', authUser, userExists, newEntry);

// Listar entradas.
app.get('/entries', authUserOptional, listEntries);

// Obtener una entrada por id.
app.get('/entries/:entryId', authUserOptional, getEntry);

// Votar una entrada.
app.post('/entries/:entryId/votes', authUser, userExists, voteEntry);

// Agregar una foto a una entrada.
app.post('/entries/:entryId/photos', authUser, userExists, addEntryPhoto);

// Eliminar una foto de una entrada.
app.delete(
    '/entries/:entryId/photos/:photoId',
    authUser,
    userExists,
    deleteEntryPhoto
);

// Middleware de error.
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.httpStatus || 500).send({
        status: 'error',
        message: err.message,
    });
});

// Middleware de ruta no encontrada.
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Ruta no encontrada',
    });
});

// Ponemos el servidor a escuchar peticiones en un puerto dado.
app.listen(process.env.PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
