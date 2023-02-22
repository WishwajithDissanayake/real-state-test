import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    modal_opened: false
};

export const RoiModalSlice = createSlice({
    name: "RoiModal",
    initialState,
    reducers: {
        open_modal: (state) => {
            state.modal_opened = true
        },
        close_modal: (state) => {
            state.modal_opened = false
        }
    }
})

// Action creators are generated for each case reducer function
export const { open_modal, close_modal } = RoiModalSlice.actions;

export default RoiModalSlice.reducer;