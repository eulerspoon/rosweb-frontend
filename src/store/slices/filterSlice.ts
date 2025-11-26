import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  nameQuery: string;
  rosCommandQuery: string;
  searchParams: {
    name?: string;
    ros_command?: string;
  };
}

const initialState: FilterState = {
  nameQuery: '',
  rosCommandQuery: '',
  searchParams: {},
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setNameQuery: (state, action: PayloadAction<string>) => {
      state.nameQuery = action.payload;
    },
    setRosCommandQuery: (state, action: PayloadAction<string>) => {
      state.rosCommandQuery = action.payload;
    },
    setSearchParams: (state, action: PayloadAction<{name?: string; ros_command?: string}>) => {
      state.searchParams = action.payload;
    },
    resetFilters: (state) => {
      state.nameQuery = '';
      state.rosCommandQuery = '';
      state.searchParams = {};
    },
  },
});

export const { setNameQuery, setRosCommandQuery, setSearchParams, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;