const multer = require("multer");

const storage = multer.memoryStorage(); // Simpan file di memori, bukan di disk
const upload = multer({ storage });

module.exports = upload;
