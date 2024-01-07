import React from 'react';
import styles from './CustomButton.module.css';

/**
 * CustomButton
 * @param {string} [type='button']
 * @param {string} [extraStyles='']
 * @param {ReactNode} children
 * @returns {JSX.Element}
 */
export default function CustomButton(props) {
  const { extraStyles, ...otherProps } = props;
  return (
    <button
      type={props.type || 'button'}
      className={`${styles.btn} ${props.extraStyles || ''}`}
      {...otherProps}
    >
      {props.children}
    </button>
  );
}
