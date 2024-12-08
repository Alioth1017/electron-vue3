const asarmor = require('asarmor');
const { join } = require('node:path');

module.exports = async (dir) => {
  const asarPath = join(dir, 'app.asar');
  console.log(`  \x1B[34m•\x1B[0m afterPack applying asarmor patches  \x1B[34mfile\x1B[0m=${asarPath}`);
  const archive = await asarmor.open(asarPath);
  archive.patch(); // apply default patches
  await archive.write(asarPath);
};
