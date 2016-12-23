#!/usr/bin/env node

const fs = require('fs')
const glob = require('glob')
const readline = require('readline')
const {resolve: resolvePath} = require('path')
const {transform} = require('babel-core')
import config from '../../config';

const babelConfig = config.plugins.babelConfig({
  target: 'client',
  mode: 'production'
});

const { locales } = config;

const plugins = babelConfig.plugins;
plugins.push(['react-intl']);

extractIntlMessages({
  babel: {
    presets: babelConfig.presets,
    plugins
  },
  locales,
  filesToParsePattern: `${__dirname}/../../src/shared/**/!(*.test).js`,
  translationsPath: resolvePath(__dirname, '../../src/translations'),
})

function animateProgress (message, amountOfDots = 3) {
  let i = 0
  return setInterval(function () {
    readline.cursorTo(process.stdout, 0)
    i = (i + 1) % (amountOfDots + 1)
    var dots = new Array(i + 1).join('.')
    process.stdout.write(message + dots)
  }, 500)
}

function createTranslationMaps (translationsPath, locales) {
  const current = {}
  const next = {}
  for (const locale of locales) {
    current[locale] = {}
    next[locale] = {}
    const translationFileName = `${translationsPath}/${locale}.json`
    try {
      const messages = JSON.parse(fs.readFileSync(translationFileName))
      for (const message of messages) {
        current[locale][message.id] = message
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        process.stderr.write(
          `There was an error loading this translation file: ${translationFileName}\n${error}`)
      }
    }
  }
  return {current, next}
}

function extractFromFile ({next, current}, babel, fileName) {
  return Promise.resolve()
    .then(() => fs.readFileSync(fileName, 'utf8'))
    .then((code) => transform(code, babel))
    .then(({metadata: result}) => {
      for (const message of result['react-intl'].messages) {
        for (const locale of locales) {
          const curr = current[locale][message.id]
          next[locale][message.id] = {
            id: message.id,
            description: message.description,
            defaultMessage: message.defaultMessage,
            message: (curr && curr.message)
              ? curr.message
              : ''
          }
        }
      }
    })
    .catch((err) => process.stderr.write(`Error transforming file: ${fileName}\n${err}\n`))
}

function extractIntlMessages({babel, locales, filesToParsePattern, translationsPath}) {
  const translationMaps = createTranslationMaps(translationsPath, locales)
  let doneCurrentTask
  return Promise.resolve()
    .then(() => {
      doneCurrentTask = task('Storing language files in memory')
      return glob.sync(filesToParsePattern)
    })
    .then((files) => {
      doneCurrentTask()
      doneCurrentTask = task('Run extraction on all files')
      return Promise.all(files.map((fileName) => extractFromFile(translationMaps, babel, fileName)))
    })
    .then(() => {
      doneCurrentTask()
      for (const locale of locales) {
        const translationFileName = `${translationsPath}/${locale}.json`
        doneCurrentTask = task(`Writing translation messages for ${locale} to: ${translationFileName}`)
        try {
          const messagesObj = Object.assign({}, translationMaps.current[locale], translationMaps.next[locale])
          const messagesArr = Object.keys(messagesObj)
            .map((key) => messagesObj[key])
            .sort((a, b) => a.id.toUpperCase().localeCompare(b.id.toUpperCase()))
          const messagesTxt = `${JSON.stringify(messagesArr, null, 2)}\n`
          fs.writeFileSync(translationFileName, messagesTxt, 'utf8')
          doneCurrentTask()
        } catch (err) {
          doneCurrentTask(
            `There was an error saving this translation file: ${translationFileName}\n${err}`)
        }
      }
    })
}

function task (message) {
  const progress = animateProgress(message)
  process.stdout.write(message)

  return (error) => {
    if (error) {
      process.stderr.write(error)
    }
    clearTimeout(progress)
    process.stdout.write(' ✓')
    process.stdout.write('\n')
  }
}
