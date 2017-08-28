module.exports = {
  success: {
    fileGenerated: (fileName, dest) => `✓ Generated ${fileName} in ${dest}.`,
    fileCopied: (fileName, dest) => `✓ Copied ${fileName} to ${dest}.`
  }
};
