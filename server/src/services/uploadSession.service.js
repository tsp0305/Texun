let currentFilePath = null;

function setCurrentFile(filePath) {
    currentFilePath = filePath;
}

function getCurrentFile() {
    return currentFilePath;
}

function clearCurrentFile() {
    currentFilePath = null;
}

module.exports = {
    setCurrentFile,
    getCurrentFile,
    clearCurrentFile,
};