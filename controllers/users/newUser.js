const insertUserQuery = require('../../db/queries/users/insertUserQuery');

const { v4: uuid } = require('uuid');

const { generateError, sendMail } = require('../../helpers');

const newUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            generateError('Faltan campos', 400);
        }

        // Generamos el código de registro.
        const registrationCode = uuid();

        // Insertamos al usuario en la base de datos.
        await insertUserQuery(email, username, password, registrationCode);

        // Creamos el asunto del email de verificación.
        const emailSubject = 'Activa tu usuario en Diario de Viajes';

        // Creamos el contenido del email.
        const emailBody = `
            ¡Bienvenid@ ${username}!

            Por favor, verifica tu usuario a través del http://localhost:8000/users/validate/${registrationCode}.
        `;

        // Enviamos el email de verificación.
        await sendMail(email, emailSubject, emailBody);

        res.send({
            status: 'ok',
            message: 'Usuario creado, revisa el email de verificación',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = newUser;
