import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';


const initialState = {
  error: null as any,
};


export const errorHandlerSlice = createSlice({
  name: 'errorHandler',
  initialState,
  // 普通同步操作
  reducers: {
    assignError: (state, action: PayloadAction<AxiosError>) => {
      state.error = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { assignError } = errorHandlerSlice.actions;

export default errorHandlerSlice.reducer;
