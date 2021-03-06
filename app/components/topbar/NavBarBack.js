// @flow
import React, { Component } from 'react';
import styles from './NavBarBack.scss';
import BackIcon from '../../assets/images/wallet-nav/back-arrow.inline.svg';

type Props = {|
  +title: string,
  +onBackClick: string => void,
  +route: string,
|};

export default class NavBarBack extends Component<Props> {

  render() {
    const { title, onBackClick, route } = this.props;

    return (
      <button
        type="button"
        className={styles.backButton}
        onClick={() => onBackClick(route)}
      >
        <span className={styles.backIcon}>
          <BackIcon />
        </span>
        {title}
      </button>
    );
  }
}
