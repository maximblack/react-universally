/* @flow */

import React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl'
import Logo from './Logo';
import Menu from './Menu';
import LocaleSwitcher from '../LocaleSwitcher';

function Header() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <LocaleSwitcher />
      <Logo />
      <h1>React, Universally</h1>
      <FormattedDate weekday="long" value={new Date(1459832991883)}/>
      <h4><FormattedMessage id="app.header.test" defaultMessage="Testing locales, default" /></h4>
      <strong>
        A starter kit giving you the minimum requirements for a modern universal react application.
      </strong>
      <Menu />
    </div>
  );
}

export default Header;
