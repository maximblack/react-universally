/* @flow */

import fs from 'fs';
import appRootDir from 'app-root-dir';
import { dirname, resolve as pathResolve } from 'path';
import projConfig from '../../config/private/project';
import sharedProjConfig from '../../config/shared/project';

const { locales } = sharedProjConfig;

console.log(locales, pathResolve(
  appRootDir.get(), projConfig.localeDataOutputPath)
);

locales.forEach(createLocaleDataFiles.bind(null, pathResolve(
  appRootDir.get(), projConfig.localeDataOutputPath)
));

function copyFile (sourcePath, targetPath) {
  return fs.writeFileSync(targetPath, fs.readFileSync(sourcePath))
}

function createLocaleDataFiles (outputPath, locale) {

  const localeInputPaths = getLocaleInputPaths(locale)
  const localeOutputPaths = getLocaleOutputPaths(outputPath, locale)

  ensureDirExists(outputPath)

  ;['intl', 'reactIntl']
    .forEach((key) => {
      console.log(' ', key)
      console.log('   ', localeInputPaths[key])
      console.log('      >', localeOutputPaths[key])

      ensureDirExists(dirname(localeOutputPaths[key]))
      copyFile(localeInputPaths[key], localeOutputPaths[key])
    })
}

function ensureDirExists (path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

function getLocaleInputPaths (locale) {
  const dashPos = locale.indexOf('-')
  const baseLocale = ~dashPos ? locale.substring(0, dashPos) : locale
  return {
    intl: require.resolve(`intl/locale-data/jsonp/${locale}`),
    reactIntl: require.resolve(`react-intl/locale-data/${baseLocale}`)
  }
}

function getLocaleOutputPaths (outputPath, locale) {
  return {
    intl: pathResolve(outputPath, 'intl', `${locale}.js`),
    reactIntl: pathResolve(outputPath, 'react-intl', `${locale}.js`),
  }
}
