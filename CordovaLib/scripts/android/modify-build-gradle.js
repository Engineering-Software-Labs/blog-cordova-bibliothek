const { join } = require('path');
const { promisify } = require('util');
const { readFile, writeFile } = require('fs');

const readFileAsync = promisify(readFile),
      writeFileAsync = promisify(writeFile);

module.exports = async (ctx) => {

  const {
    requireCordovaModule,
    opts: {
      platforms,
      projectRoot,
    },
  } = ctx;

  if(platforms.indexOf('android') >= 0) {

    const platformRoot = join(projectRoot, 'platforms', 'android'),
          buildGradleLocation = join(platformRoot, 'app', 'build.gradle'),
          _ = requireCordovaModule('lodash');

    const RULES = [
      [
        `apply plugin: 'com.android.application'`,
        `apply plugin: 'com.android.library'`,
      ],
      [
        `applicationId privateHelpers.extractStringFromManifest("package")`,
        ``,
      ],
    ];

    await writeFileAsync(buildGradleLocation,
                         _.reduce(RULES,
                                  (result, [ a, b ]) =>
                                    result.replace(a, b),
                                  await readFileAsync(buildGradleLocation, 'utf8')),
                         'utf8');
  }
};
