/*
 * Language selection
 * language is set with cookies and requires a refresh.
 * Current language is set under window.lang by the server
 * Available languages under window.langSel
 *           [['hz', 'am'], ['de', 'de'], ...]
 *           [languageCode, countryCode (for flag)]
 * @flow
 */
import React, { useState, useEffect } from 'react';
import { t } from 'ttag';
import { MONTH } from '../core/constants';

function LanguageSelect() {
  if (!navigator.cookieEnabled) {
    return null;
  }

  const { lang, langs } = window.ssv;

  const [langSel, setLangSel] = useState(lang);
  const [ccSel, setCCSel] = useState('xx');

  useEffect(() => {
    for (let i = 0; i < langs.length; i += 1) {
      const [lc, cc] = langs[i];
      if (lc === langSel) {
        setCCSel(cc);
        return;
      }
    }
  }, [langSel]);

  return (
    <div style={{ textAlign: 'right' }}>
      <span>
        <select
          onChange={(e) => {
            const sel = e.target;
            setLangSel(sel.options[sel.selectedIndex].value);
          }}
        >
          {
            langs.map(([l]) => (
              <option
                selected={l === langSel}
                value={l}
              >
                {l.toUpperCase()}
              </option>
            ))
          }
        </select>
      </span>&nbsp;&nbsp;
      <span>
        <img
          style={{ height: '1em', imageRendering: 'crisp-edges' }}
          alt=""
          src={`${window.ssv.assetserver}/cf/${ccSel}.gif`}
        />
      </span>
      <button
        type="submit"
        style={{ display: 'block', margin: 5 }}
        onClick={() => {
          /* set with selected language */
          const d = new Date();
          d.setTime(d.getTime() + 24 * MONTH);
          document.cookie = `lang=${langSel};expires=${d.toUTCString()};path=/`;
          window.location.reload();
        }}
      >
        {t`Save`}
      </button>
    </div>
  );
}

export default LanguageSelect;
