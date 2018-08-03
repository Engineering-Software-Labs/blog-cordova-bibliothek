const { join } = require('path');
const { promisify } = require('util');
const { exists, unlink, link, stat, mkdir, readdir, constants } = require('fs');

const existsAsync = promisify(exists),
      unlinkAsync = promisify(unlink),
      linkAsync = promisify(link),
      statAsync = promisify(stat),
      mkdirAsync = promisify(mkdir),
      readdirAsync = promisify(readdir);


const copy = async (src, dest) => {
  if(await existsAsync(dest))
    await unlinkAsync(dest);
  await linkAsync(src, dest);
};

const copyRecursive = async (src, dest) => {
  const srcExists = await existsAsync(src),
        destExists = await existsAsync(dest),
        stats = srcExists && await statAsync(src);

  if(srcExists && stats.isDirectory()) {
    if(!destExists)
      await mkdirAsync(dest);

    for(const childItemName of await readdirAsync(src)) {
      await copyRecursive(join(src, childItemName),
                          join(dest, childItemName));
    }
  }
  else
    await copy(src, dest)
};

module.exports = async (ctx) => {

  const {
    opts: {
      platforms,
      projectRoot,
    },
  } = ctx;

  if(platforms.indexOf('android') >= 0) {

    const platformRoot = join(projectRoot, 'platforms', 'android'),
          cordovaLibSrcLocation = join(platformRoot, 'CordovaLib', 'src'),
          appSrcLocation = join(platformRoot, 'app', 'src', 'main', 'java');

    await copyRecursive(cordovaLibSrcLocation,
                        appSrcLocation);
  }
};
