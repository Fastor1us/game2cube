import React from 'react';
import styles from './CustomButton.module.css';

/**
 * CustomButton
 * @param {string} [type='button']
 * @param {string} [extraClass='']
 * @param {ReactNode} children
 * @returns {JSX.Element}
 */
export default function CustomButton(props) {
  const { extraClass, ...otherProps } = props;
  return (
    <button
      type={props.type || 'button'}
      className={`${styles.btn} ${props.extraClass || ''}`}
      {...otherProps}
    >
      {props.children}
    </button>
  );
}
