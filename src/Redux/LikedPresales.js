import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    likedPresales: null,
    likedPresalesLength: 0
};

export const likedPresalesSlice = createSlice({
    name: "presaleListFilters",
    initialState,
    reducers: {
        initializeLikedPresales: (state, action) => {
            state.likedPresales = localStorage.getItem(action.payload) 
            ? JSON.parse(localStorage.getItem(action.payload)).favoritePresales
            : null
            state.likedPresalesLength = localStorage.getItem(action.payload) 
            ? JSON.parse(localStorage.getItem(action.payload)).favoritePresales.length
            : 0
        },
        changeOnLikedPresales: (state, action) => {
            state.likedPresales = action.payload
            state.likedPresalesLength = action.payload.length
        },
    }
})

// Action creators are generated for each case reducer function
export const { initializeLikedPresales, changeOnLikedPresales  } = likedPresalesSlice.actions;

export default likedPresalesSlice.reducer;