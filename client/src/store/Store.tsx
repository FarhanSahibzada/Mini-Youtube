import { configureStore } from "@reduxjs/toolkit";
import UserReducer from './Userslice'
import playlistSlice from './PlatlistSlice'

const Store =  configureStore({
    reducer : {
      auth :  UserReducer,
      playlist : playlistSlice
    }
})


export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store ;