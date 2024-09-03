// src/redux/reducers/searchSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  selectedYear: [],
  selectedAuthor: [],
  selectedMainCategory: '',
  selectedSubCategory: '',
  selectedLanguages: '',
  isApprove: 'approved',
  page: 0,
  rowsPerPage: 10
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setSelectedYear(state, action) {
      state.selectedYear = action.payload;
    },
    setSelectedAuthor(state, action) {
      state.selectedAuthor = action.payload;
    },
    setSelectedMainCategory(state, action) {
      state.selectedMainCategory = action.payload;
    },
    setSelectedSubCategory(state, action) {
      state.selectedSubCategory = action.payload;
    },
    setSelectedLanguages(state, action) {
      state.selectedLanguages = action.payload;
    },
    setIsApprove(state, action) {
      state.isApprove = action.payload;
    },
    set_Page(state, action) {
      state.page = action.payload;
    },
    set_RowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    resetSearchState(state) {
      return initialState;
    }
  }
});

export const {
  setSearchQuery,
  setSelectedYear,
  setSelectedAuthor,
  setSelectedMainCategory,
  setSelectedSubCategory,
  setSelectedLanguages,
  setIsApprove,
  set_Page,
  set_RowsPerPage,
  resetSearchState
} = searchSlice.actions;

export default searchSlice.reducer;
