import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import ModalOverlay from './ModalOverlay/ModalOverlay';
import styles from './Modal.module.css';


export default function Modal(props) {
  const modalRoot = document.querySelector('#modal');

  const closePopup = () => {
    props.setVisible(false);
  }

  useEffect(() => {
    const escClickHandler = (e) => {
      e.key === 'Escape' && closePopup();
    }
    document.addEventListener('keydown', escClickHandler);
    return () => {
      document.removeEventListener('keydown', escClickHandler);
    };
  }, []);

  return createPortal(<>
    <ModalOverlay closePopup={closePopup} />
    <section className={styles.container}>
      <section className={styles.header}>
        <h2 className={styles.title}>
          {props.title || ''}
        </h2>
        <div className={styles.closeBtn} onClick={closePopup}>
          X
        </div>
      </section>
      {props.children}
    </section>
  </>,
    modalRoot,
  );
}
