import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchValue: "",
    filterValue: "",
    sortValue: ""
};

export const presaleListFiltersSlice = createSlice({
    name: "presaleListFilters",
    initialState,
    reducers: {
        changeSearchValue: (state, action) => {
            state.searchValue = action.payload
        },
        changeFilterValue: (state, action) => {
            state.filterValue = action.payload
        },
        changeSortValue: (state, action) => {
            state.sortValue = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { changeSearchValue, changeFilterValue, changeSortValue } = presaleListFiltersSlice.actions;

export default presaleListFiltersSlice.reducer;