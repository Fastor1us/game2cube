import React, { useEffect, useRef, useState } from 'react';
import Modal from '../../components/Modal/Modal';


const DeleteModal = (props) => {
  const [timer, setTimer] = useState(5);
  const ref = useRef(null);

  useEffect(() => {
    if (props.useTimer) {
      setTimer(5);
      clearInterval(ref.current);
      ref.current = setInterval(
        () => setTimer((prevTimer) => prevTimer - 1), 1000
      );
      return () => clearInterval(ref.current);
    }
  }, []);

  return (
    <Modal setVisible={props.setVisible} title={props.title}>
      <section style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'black' }}>
          Внимание! Данное действие безвозвратное!
        </h2>
        <button disabled={props.useTimer && timer !== 0}
          onClick={props.onHandleClick}
        >
          {'Подтвердить' + (props.useTimer ?
            ((timer !== 0 ? ` (${timer})` : '')) : '')}
        </button>
      </section>
    </Modal>
  );
}

DeleteModal.defaultProps = {
  useTimer: true
}

export default DeleteModal;
