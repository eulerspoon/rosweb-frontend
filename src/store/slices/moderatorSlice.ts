import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModeratorFilters {
  status: string;
  dateFrom: string;
  dateTo: string;
  creatorUsername: string;
  searchParams: {
    status?: string;
    date_from?: string;
    date_to?: string;
    creator_username?: string;
  };
}

interface ModeratorState {
  filters: ModeratorFilters;
  pollingInterval: number;
  isPolling: boolean;
}

const initialState: ModeratorState = {
  filters: {
    status: '',
    dateFrom: '',
    dateTo: '',
    creatorUsername: '',
    searchParams: {},
  },
  pollingInterval: 5000, // 5 секунд
  isPolling: false,
};

const moderatorSlice = createSlice({
  name: 'moderator',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },
    setDateFromFilter: (state, action: PayloadAction<string>) => {
      state.filters.dateFrom = action.payload;
    },
    setDateToFilter: (state, action: PayloadAction<string>) => {
      state.filters.dateTo = action.payload;
    },
    setCreatorUsernameFilter: (state, action: PayloadAction<string>) => {
      state.filters.creatorUsername = action.payload;
    },
    setSearchParams: (state, action: PayloadAction<ModeratorFilters['searchParams']>) => {
      state.filters.searchParams = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        status: '',
        dateFrom: '',
        dateTo: '',
        creatorUsername: '',
        searchParams: {},
      };
    },
    setPollingInterval: (state, action: PayloadAction<number>) => {
      state.pollingInterval = action.payload;
    },
    setPolling: (state, action: PayloadAction<boolean>) => {
      state.isPolling = action.payload;
    },
  },
});

export const {
  setStatusFilter,
  setDateFromFilter,
  setDateToFilter,
  setCreatorUsernameFilter,
  setSearchParams,
  resetFilters,
  setPollingInterval,
  setPolling,
} = moderatorSlice.actions;

export default moderatorSlice.reducer;