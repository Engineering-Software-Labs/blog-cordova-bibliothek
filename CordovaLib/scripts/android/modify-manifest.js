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
          manifestLocation = join(platformRoot, 'app', 'src', 'main', 'AndroidManifest.xml'),
          _ = requireCordovaModule('lodash');

    const RULES = [
      [
        /android:versionCode="[^"]+"/,
        ``,
      ],
      [
        /android:versionName="[^"]+"/,
        ``,
      ],
      [
        `android:icon="@mipmap/icon"`,
        ``,
      ],
      [
        `android:label="@string/app_name"`,
        ``,
      ],
    ];

    await writeFileAsync(manifestLocation,
                         _.reduce(RULES,
                                  (result, [ a, b ]) =>
                                    result.replace(a, b),
                                  await readFileAsync(manifestLocation, 'utf8')),
                         'utf8');
  }
};
