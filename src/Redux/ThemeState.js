import { createSlice } from "@reduxjs/toolkit";

// initialize userToken from local storage
const themeState = localStorage.getItem('kingsale-theme')
  ? localStorage.getItem('kingsale-theme') : "dark"

const initialState = {
    theme: themeState
}

export const themeSlice = createSlice({
  name: "kingsale-theme",
  initialState,
  reducers: {
    darkTheme: (state) => {
        localStorage.setItem('kingsale-theme', "dark")
        state.theme = "dark"
    },
    lightTheme: (state) => {
        localStorage.setItem('kingsale-theme', "light")
        state.theme = "light"
    },
  }
});

// Action creators are generated for each case reducer function
export const { darkTheme, lightTheme } = themeSlice.actions;

export default themeSlice.reducer;