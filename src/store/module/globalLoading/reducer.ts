import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
};


export const loadingSlice = createSlice({
  name: 'globalLoading',
  initialState,
  // 普通同步操作
  reducers: {
    hideLoading: (state) => {
      state.loading = false;
    },
    showLoading: (state) => {
      state.loading = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { hideLoading, showLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
