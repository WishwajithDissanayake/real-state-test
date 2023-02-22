import { configureStore } from "@reduxjs/toolkit";
import SidemenuMarginReducer from "./SidemenuMargin";
import WalletConnectReducer from "./WalletConnect";
import RoiModalReducer  from "./RoiModal";
import ThemeReducer from './ThemeState'
import BlockChainChangeReducer from "./BlockChainChange";
import LanguageReducer from "./Language";
import PresaleListFiltersReducer from "./PresaleListFilters";
import LikedPresalesReducer from "./LikedPresales";

export const Store = configureStore({
  reducer: {
    margin: SidemenuMarginReducer,
    connectModalState: WalletConnectReducer,
    roiModalState: RoiModalReducer,
    themeState: ThemeReducer,
    blockchainModalState: BlockChainChangeReducer,
    languageState: LanguageReducer,
    presaleListFilters: PresaleListFiltersReducer,
    likedPresales: LikedPresalesReducer
  }
});