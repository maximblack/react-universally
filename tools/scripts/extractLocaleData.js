/* @flow */

import fs from 'fs';
import appRootDir from 'app-root-dir';
import { dirname, resolve as pathResolve } from 'path';
import config from '../../config';

const { locales } = config;

locales.forEach(createLocaleDataFiles.bind(null, pathResolve(
  appRootDir.get(), config.localeDataPath)
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
