/* @flow */

import requestLanguage from 'express-request-language';
import { readFileSync } from 'fs';
import ms from 'ms';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import type { Middleware, $Request, $Response, NextFunction } from 'express';
import { polyfillNodeIntlApi, registerLocaleData } from '../../shared/utils/intl';
import config from '../../../config';

// Ensure Intl on node
polyfillNodeIntlApi(config.locales);

// Register locale data for each locale
config.locales.map(registerLocaleData);

// An express middleware that is responsible for providing translations on demand.
export const getTranslation = function (req: $Request, res: $Response) {
  const locale = req.params.locale;

  if (!config.locales.includes(locale)) {
    res.status(400).send(`Locale '${locale}' not supported`);
  }

  let localeData;
  try {
    // Using readFileSync here instead of require, because require is caching the file contents
    localeData = readFileSync(
      pathResolve(
        appRootDir.get(),
        config.translationsPath, `${locale}.json`,
      ),
    );
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.status(500).send(`Locale '${locale}' not found`);
    }
  }

  res.send(JSON.parse(localeData));
};

const intlMiddleware = [
  // A middleware to figure out a request's language tag by parsing Accept-Language header and stored cookies.
  // @see https://github.com/tinganho/express-request-language
  requestLanguage({
    languages: config.locales,
    queryName: 'lang',
    cookie: {
      name: config.cookies.localeName,
      options: {
        path: '/',
        maxAge: ms(config.cookies.localeMaxAge) / 1000,
      },
      url: '/lang/{language}',
    },
  }),
];

export default (intlMiddleware : Array<Middleware>);
