"use strict";
const cleanFileName = (fileName) => {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, "_"); // Ganti karakter khusus dengan "_"
};
module.exports = cleanFileName;
