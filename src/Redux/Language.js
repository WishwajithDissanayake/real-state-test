import { createSlice } from "@reduxjs/toolkit";

// initialize language from local storage
const langState = localStorage.getItem('kingsale-lang')
  ? localStorage.getItem('kingsale-lang') : "en"

const initialState = {
    lang: langState
}

export const langSlice = createSlice({
  name: "kingsale-language",
  initialState,
  reducers: {
    changeLang: (state, action) => {
        localStorage.setItem('kingsale-lang', action.payload)
        state.lang = action.payload
    }
  }
});

// Action creators are generated for each case reducer function
export const { changeLang } = langSlice.actions;

export default langSlice.reducer;