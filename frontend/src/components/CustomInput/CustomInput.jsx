import React, { useEffect, useRef, useState } from 'react';
import styles from './CustomInput.module.css';


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
  console.log(rest);
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { validity } = inputRef.current;
    console.log(event);
    console.log(validity);
    const value = event.target.value;

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

    onChange(event);
  };

  useEffect(() => {
    shouldSetFocusOnLoad && inputRef.current.focus();
  }, []);

  return (
    <>
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
        {error}
      </div>
    </>
  );
};

CustomInput.defaultProps = {
  required: true,
  disabled: false,
  shouldSetFocusOnLoad: false,
};

export default CustomInput;
