# Diario de viajes

-   Se trata de una web donde los usuarios publican entradas sobre viajes.

-   Cada entrada tiene título, descripción, lugar y hasta 3 fotos asignadas.

-   Cada entrada puede ser votada con una puntuación entre 1 y 5.

## Instalar

-   Crear una base de datos vacía en una instancia de MySQL local.

-   Instalar las dependencias mediante el comando `npm install` o `npm i`.

-   Guardar el archivo `.env.example` como `.env` y cubrir los datos necesarios.

-   Ejecutar `npm run initDB` para crear las tablas necesarias en la base de datos anteriormente creada.

-   Ejecutar `npm run dev` o `npm start` para lanzar el servidor.

-   Importar la colección de Postman para poder probar los endpoints.

## Base de datos

-   **`users:`** id, email`*`, password`*`, username`*`, avatar, role ("admin", "normal"), active, registrationCode, recoverPassCode, createdAt, modifiedAt.

-   **`entries:`** id, title`*`, place`*`, description`*`, userId, createdAt.

-   **`entryPhotos:`** id, name, entryId, createdAt.

-   **`entryVotes:`** id, value`*`, entryId, userId, createdAt.

## Endpoints del usuario

-   **POST** - [`/users`] - Crea un usuario pendiente de validar. ✅
-   **PUT** - [`/users/validate/:regCode`] - Valida a un usuario recién registrado. ✅
-   **POST** - [`/users/login`] - Logea a un usuario retornando un token. ✅
-   **GET** - [`/users/:userId`] - Retorna información de un usuario concreto. ✅
-   **GET** - [`/users`] - Retorna información del usuario del token. ➡️ `Token` ✅
-   **PUT** - [`/users/avatar`] - Permite actualizar el avatar del usuario. ➡️ `Token` ✅
-   **PUT** - [`/users/password/recover`] - Envía al usuario un correo de recuperación de contraseña. ✅
-   **PUT** - [`/users/password`] - Resetea la contraseña de un usuario utilizando un código de recuperación. ✅

## Endpoints del diario

-   **POST** - [`/entries`] - Crea una entrada. ➡️ `Token` ✅
-   **GET** - [`/entries`] - Retorna el listado de entradas. ✅
-   **GET** - [`/entries/:entryId`] - Retorna una entrada en concreto. ✅
-   **POST** - [`/entries/:entryId/votes`] - Vota una entrada (entre 1 y 5). ➡️ `Token` ✅
-   **POST** - [`/entries/:entryId/photos`] - Agregar una foto a una entrada. ➡️ `Token` ✅
-   **DELETE** - [`/entries/:entryId/photos/:photoId`] - Eliminar una foto de una entrada. ➡️ `Token` ✅
