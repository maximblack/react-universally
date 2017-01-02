/* @flow */

import React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import Logo from './Logo';
import Menu from './Menu';
import LocaleSwitcher from '../LocaleSwitcher';

function Header() {
  return (
    <header style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <LocaleSwitcher />
        <Logo />
        <h1>React, Universally</h1>
        Today is <FormattedDate weekday="long" value={new Date()} />
        <h4>
          <FormattedMessage id="app.header.test" defaultMessage="Testing locales, default" />
        </h4>
        <strong>
          A starter kit giving you the minimum requirements for a modern universal react application.
        </strong>
        <Menu />
    </header>
  );
}

export default Header;
