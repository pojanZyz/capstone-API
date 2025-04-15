const cleanFileName = (fileName: string): string => {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, "_"); // Ganti karakter khusus dengan "_"
};

module.exports = cleanFileName;