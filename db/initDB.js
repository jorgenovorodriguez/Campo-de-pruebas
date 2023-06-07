require('dotenv').config();

const getDB = require('./getDB');

const main = async () => {
    let connection;

    try {
        connection = await getDB();

        console.log('Borrando tablas...');

        await connection.query('DROP TABLE IF EXISTS entryVotes');
        await connection.query('DROP TABLE IF EXISTS entryPhotos');
        await connection.query('DROP TABLE IF EXISTS entries');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log('Creando tablas...');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(30) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                avatar VARCHAR(100),
                role ENUM('admin', 'normal') DEFAULT 'normal',
                registrationCode VARCHAR(100),
                recoverPassCode VARCHAR(100),
                active BOOLEAN DEFAULT false,
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS entries (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(30) NOT NULL,
                place VARCHAR(30) NOT NULL,
                description TEXT NOT NULL,
                userId INT UNSIGNED NOT NULL,
                createdAt DATETIME NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS entryPhotos (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                entryId INT UNSIGNED NOT NULL,
                createdAt DATETIME NOT NULL,
                FOREIGN KEY (entryId) REFERENCES entries(id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS entryVotes (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                value TINYINT UNSIGNED NOT NULL,
                userId INT UNSIGNED NOT NULL,
                entryId INT UNSIGNED NOT NULL,
                createdAt DATETIME NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id),
                FOREIGN KEY (entryId) REFERENCES entries(id)
            )
        `);

        console.log('¡Tablas creadas!');
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
};

main();
