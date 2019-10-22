import { createSlice } from 'redux-starter-kit';

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    loading: false
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setLoading } = statusSlice.actions;

export default statusSlice.reducer;
