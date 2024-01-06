import React from 'react';
import CustomInput from '../../../components/CustomInput/CustomInput';

function CustomInputWrapper(props) {
  return (
    <CustomInput
      minLength={props.minLength || 4}
      maxLength={props.maxLength || 25}
      shouldSetFocusOnLoad={props.shouldSetFocusOnLoad}
      disabled={props.disabled}
      {...props}
    />
  );
}

export function EmailInput(props) {
  return (
    <CustomInputWrapper
      type="email"
      minLength={7}
      {...props}
    />
  );
}

export function PasswordInput(props) {
  return (
    <CustomInputWrapper
      type="password"
      {...props}
    />
  );
}

export function TextInput(props) {
  return (
    <CustomInputWrapper
      type="text"
      maxLength={12}
      {...props}
    />
  );
}
