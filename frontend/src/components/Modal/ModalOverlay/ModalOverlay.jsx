import React from 'react';
import styles from './ModalOverlay.module.css';


export default function ModalOverlay(props) {
  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        e.target === e.currentTarget && props.closePopup();
      }}
    >
    </div>
  );
}
