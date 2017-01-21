/* eslint-disable no-shadow */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { setLocale } from '../../actions/intl';
import { selectIntlLocale, selectAvailableLanguages } from '../../reducers/intl';

function LanguageSwitcher({ currentLocale, availableLocales, setLocale }) {

  const isSelected = (locale) => locale === currentLocale;
  const localeDict = {
    'en-US': 'English',
    'cs-CZ': 'Česky',
  };
  const localeName = (locale) => localeDict[locale] || locale;

  return (
    <div style={{
      position: 'absolute',
    }}>
      {availableLocales.map(locale => (
        <span key={locale}>
          {isSelected(locale) ? (
            <span style={{
              padding: '10px',
              border: '1px solid black',
            }}>{localeName(locale)}</span>
          ) : (
            // github.com/yannickcr/eslint-plugin-react/issues/945
            // eslint-disable-next-line react/jsx-indent
            <div
              style={{
                padding: '10px',
                display: 'inline-block',
                cursor: 'pointer',
              }}
              //href={`?lang=${locale}`}
              onClick={(e) => {
                setLocale(locale);
                e.preventDefault();
              }}
            >{localeName(locale)}</div>
          )}
          {' '}
        </span>
      ))}
    </div>
  );
}

LanguageSwitcher.propTypes = {
  currentLocale: PropTypes.string.isRequired,
  availableLocales: PropTypes.arrayOf(PropTypes.string).isRequired,
  setLocale: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  availableLocales: selectAvailableLanguages()(state),
  currentLocale: selectIntlLocale()(state)
});

const mapDispatch = {
  setLocale,
};

export default connect(mapStateToProps, mapDispatch)(LanguageSwitcher);
