/* @flow */

import React from 'react';
import { FormattedMessage, FormattedDate, FormattedRelative } from 'react-intl';
import Logo from './Logo';
import Menu from './Menu';
import LocaleSwitcher from '../LocaleSwitcher';

function Header() {
  return (
    <header style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <LocaleSwitcher />
        <Logo />
        <h1>React, Universally</h1>
        <p>Today is <FormattedDate weekday="long" value={new Date()} /></p>
        <p>New year was <FormattedRelative value={new Date(new Date().getFullYear(), 0, 1)} /></p>
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
