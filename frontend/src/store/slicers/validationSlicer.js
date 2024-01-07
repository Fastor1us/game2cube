import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inputs: {}
};

const validationSlicer = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    setInputValidation(state, action) {
      state.inputs[action.payload.key] = action.payload.value;
    },
    setFormValidation(state, action) {
      state.isFormValid = action.payload;
    },
    resetValidation(state, action) {
      return { ...initialState };
    }
  },
});

export const {
  setInputValidation,
  setFormValidation,
  resetValidation
} = validationSlicer.actions;

export default validationSlicer.reducer;
