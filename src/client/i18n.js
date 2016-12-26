import { safeConfigGet } from '../shared/utils/config';

safeConfigGet(['locales']).map((locale) => {
  import(`../translations/${locale}.json`);
});
