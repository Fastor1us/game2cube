export const validationSelector = state => state.validation;

export const inputsValidationSelector = state => validationSelector(state).inputs;

export const isFormValidSelector = state => validationSelector(state).isFormValid;

