const { error } = require('console');
const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');
const nodemailer = require('nodemailer');

// Obtenemos las variables de entorno necesarias.
const { SMTP_USER, SMTP_PASS, UPLOADS_DIR } = process.env;

/**
 * ####################
 * ## Generate Error ##
 * ####################
 */

const generateError = (msg, code) => {
  const err = new Error(msg);
  err.httpStatus = code;
  throw err;
};

/**
 * ################
 * ## Save Photo ##
 * ################
 */

const savePhoto = async (img, width) => {
  try {
    // Rutacon la imagen dada.
    const sharpImg = sharp(img.data);

    // Redimensionamos la imagen. Width representa un tamaño en píxeles.
    sharpImg.resize(width);

    // Generamos un nombre único para la imagen dado que no podemos guardar dos imágenes
    // con el mismo nombre en la carpeta uploads.
    const imgName = `${uuid()}.jpg`;

    // Ruta absoluta a la imagen.
    const imgPath = path.join(uploadsPath, imgName);

    // Guardamos la imagen.
    sharpImg.toFile(imgPath);

    // Retornamos el nombre de la imagen.
    return imgName;
  } catch (err) {
    console.error(err);
    generateError('Error al guardar la imagen en el servidor', 500);
  }
};

/**
 * ##################
 * ## Delete Photo ##
 * ##################
 */

const deletePhoto = async (imgName) => {
  try {
    // Ruta absoluta al archivo que queremos elimiar.
    const imgPath = path.join(__dirname, UPLOADS_DIR, imgName);

    try {
      await fs.access(imgPath);
    } catch {
      // Si no existe el archivo finalizamos la función.
      return;
    }

    // Eliminamos el archivo de la carpeta de uploads.
    await fs.unlink(imgPath);
  } catch (err) {
    console.error(err);
    generateError('Error al eliminar la imagen del servidor', 500);
  }
};

/**
 * ###############
 * ## Send Mail ##
 * ###############
 */

// Creamos un transporte para poder enviar emails con nodemailer.
const transport = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const sendMail = async (email, subject, body) => {
  try {
    const mailOptions = {
      from: SMTP_USER,
      to: email,
      subject,
      text: body,
    };

    await transport.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
    generateError('Error al enviar el email al usuario', 500);
  }
};

module.exports = {
  generateError,
  savePhoto,
  deletePhoto,
  sendMail,
};
