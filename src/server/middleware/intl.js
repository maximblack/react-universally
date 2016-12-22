/* @flow */

import requestLanguage from 'express-request-language';
import type { Middleware, $Request, $Response, NextFunction } from 'express';
import projConfig from '../../../config/private/project';
import envConfig from '../../../config/private/environment';
import { polyfillNodeIntlApi } from '../../shared/utils/intl';
import sharedProjConfig from '../../../config/shared/project';

// Ensure Intl on node
polyfillNodeIntlApi(sharedProjConfig.locales);

// Attach a unique "nonce" to every response.  This allows use to declare
// inline scripts as being safe for execution against our content security policy.
// @see https://helmetjs.github.io/docs/csp/
function nonceMiddleware(req: $Request, res: $Response, next: NextFunction) {
  //res.locals.nonce = uuid(); // eslint-disable-line no-param-reassign
  next();
}

const intlMiddleware = [
  nonceMiddleware,

  // A middleware to figure out a request's language tag by parsing Accept-Language header and stored cookies.
  // @see https://github.com/tinganho/express-request-language
  requestLanguage({
    languages: sharedProjConfig.locales,
    queryName: 'lang',
    cookie: {
      name: 'lang',
      options: {
        path: '/',
        maxAge: 3650 * 24 * 3600 * 1000, // 10 years in miliseconds
      },
      url: '/lang/{language}',
    },
  }),

];

export default (intlMiddleware : Array<Middleware>);
