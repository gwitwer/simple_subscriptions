import React from 'react';
import { FormattedMessage } from 'react-intl';

// Import Style
import styles from './Footer.css';

export function Footer() {
  return (
    <div className={styles.footer}>
      <p>&copy; 2018 &middot; Mavenly</p>
    </div>
  );
}

export default Footer;
