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

const misHuevos = 'chupate esta git';
