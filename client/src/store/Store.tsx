import { configureStore } from "@reduxjs/toolkit";
import UserReducer from './Userslice'

const Store =  configureStore({
    reducer : {
      auth :  UserReducer
    }
})


export default Store ;