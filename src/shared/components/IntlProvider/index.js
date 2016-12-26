import React from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { selectIntlState } from '../../reducers/intl';

export default connect(selectIntlState)(({ locale, initialNow, messages, children }) => (
  <IntlProvider
    initialNow={initialNow}
    locale={locale}
    messages={messages ? messages[locale] : {}}
    defaultLocale="en"
  >
    {React.Children.only(children)}
  </IntlProvider>
));
