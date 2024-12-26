import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInfo = {
  id: string;
  watchHistory: Array<object>; 
  username: string;
  email: string;
  fullname?: string;
  avatar: string;
  coverimage?: string;
};

type InitialState = {
  userLogin: UserInfo | null;
  logout: boolean;
  searchTerm?: string;
};

const initialState: InitialState = {
  userLogin: null, 
  logout: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<UserInfo>) => {
      state.userLogin = action.payload;
      state.logout = false; 
    },
    logout: (state) => {
      state.userLogin = null; 
      state.logout = true; 
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload; 
    },
  },
});

export const { userLogin, logout, setSearchTerm } = userSlice.actions;

export default userSlice.reducer;
