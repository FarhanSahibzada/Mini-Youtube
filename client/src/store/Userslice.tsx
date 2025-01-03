import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInfo = {
  id: string;
  watchHistory: Array<object>;
  username: string;
  email: string;
  fullname?: string;
  avatar: { url : string };
  coverimage?: {url : string};
};

type InitialState = {
  userLogin: UserInfo | null;
  authStatus: boolean;
  searchTerm?: string;
};

const initialState: InitialState = {
  userLogin: null,
  authStatus: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<UserInfo>) => {
      state.userLogin = action.payload;
      state.authStatus = true;
    },
    logout: (state) => {
      state.userLogin = null;
      state.authStatus = false;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { userLogin, logout, setSearchTerm } = userSlice.actions;

export default userSlice.reducer;
