import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    blockchain_modal_opened: false
};

export const BlockChainModalSlice = createSlice({
    name: "RoiModal",
    initialState,
    reducers: {
        open_blockchain_modal: (state) => {
            state.blockchain_modal_opened = true
        },
        close_blockchain_modal: (state) => {
            state.blockchain_modal_opened = false
        }
    }
})

// Action creators are generated for each case reducer function
export const { open_blockchain_modal, close_blockchain_modal } = BlockChainModalSlice.actions;

export default BlockChainModalSlice.reducer;