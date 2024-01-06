import React, { useEffect, useRef, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import CustomButton from '../../components/CustomButton/CustomButton';


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

  useEffect(() => {
    timer === 0 && clearInterval(ref.current);
  }, [timer]);

  return (
    <Modal setVisible={props.setVisible} title={props.title}>
      <section style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'black' }}>
          Внимание! Данное действие безвозвратное!
        </h2>
        <CustomButton disabled={props.useTimer && timer !== 0}
          onClick={props.onHandleClick}
          style={{ width: '250px', margin: '10px 0 12px' }}
        >
          {'Подтвердить' + (props.useTimer ?
            ((timer !== 0 ? ` (${timer})` : '')) : '')}
        </CustomButton>
      </section>
    </Modal>
  );
}

DeleteModal.defaultProps = {
  useTimer: true
}

export default DeleteModal;
