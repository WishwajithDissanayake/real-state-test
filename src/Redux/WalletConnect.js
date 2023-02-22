import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    modal_opened: false
};

export const walletConnectSlice = createSlice({
    name: "walletconnect",
    initialState,
    reducers: {
        open: (state) => {
            state.modal_opened = true
        },
        close: (state) => {
            state.modal_opened = false
        }
    }
})

// Action creators are generated for each case reducer function
export const { open, close } = walletConnectSlice.actions;

export default walletConnectSlice.reducer;