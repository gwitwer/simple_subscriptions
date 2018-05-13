import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { DisplayText } from "@shopify/polaris";

// Import Style
import styles from './Header.css';

export function Header(props, context) {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <DisplayText size="large">
          <Link to="/" >Simple Subsriptions</Link>
        </DisplayText>
        {
          context.router.isActive('/', true)
            ? <a className={styles['add-post-button']} href="#" onClick={props.toggleAddPost}>Add Post</a>
            : null
        }
      </div>
    </div>
  );
}

Header.contextTypes = {
  router: React.PropTypes.object,
};

Header.propTypes = {
};

export default Header;
