import React, { useEffect, useRef, useState } from 'react';
import styles from './CustomInput.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  setInputValidation, resetValidation, setFormValidation
} from '../../store/slicers/validationSlicer';
import { inputsValidationSelector } from '../../store/selectors/validationSelector';


const CustomInput = ({
  type,
  id,
  name,
  minLength,
  maxLength,
  required,
  disabled,
  shouldSetFocusOnLoad,
  onChange,
  ...rest
}) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');

  const inputsValidation = useSelector(inputsValidationSelector);

  useEffect(() => {
    if (Object.keys(inputsValidation).length === 0) {
      dispatch(setFormValidation(true));
    } else {
      dispatch(setFormValidation(
        Object.entries(inputsValidation)
          .every((item) => {
            return item[1];
          })
      ));
    }
  }, [inputsValidation]);

  const validKey = name || type;

  const handleChange = (event) => {
    const { validity } = inputRef.current;
    const value = event.target.value;

    const setError = (msg) => {
      if (msg.length > 0) {
        dispatch(setInputValidation({
          key: validKey,
          value: false
        }));
      } else {
        dispatch(setInputValidation({
          key: validKey,
          value: true
        }));
      }
      setErrorMsg(msg);
    }

    if (!validity.valid) {
      setError(inputRef.current.validationMessage);
    } else {
      setError('');
    }

    if (type === 'password') {
      if (value.length === 0 && required) {
        setError('Вы пропустили это поле.');
      }
      if (value.length > 0 &&
        (value.length < minLength || value.length > maxLength)
      ) {
        setError(`
          Пароль должен содержать от ${minLength} до ${maxLength} символов.
        `);
      }
    }

    if (type === 'email') {
      if (value.length > 0 && !/.+@.+\..+/.test(value)) {
        setError('Неверный формат адреса электронной почты');
      }
    }

    onChange(event);
  };

  useEffect(() => {
    shouldSetFocusOnLoad && inputRef.current.focus();

    required && dispatch(setInputValidation({
      key: validKey,
      value: inputRef.current.validity.valid
    }));

    return () => {
      dispatch(resetValidation());
    }
  }, []);

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type={type}
        id={id || type}
        name={name || type}
        ref={inputRef}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        onInput={handleChange}
        {...rest}
      />
      <div className={styles.error}>
        {errorMsg}
      </div>
    </div>
  );
};

CustomInput.defaultProps = {
  required: true,
  disabled: false,
  shouldSetFocusOnLoad: false,
};

export default CustomInput;
