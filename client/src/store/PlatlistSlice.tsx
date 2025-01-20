import { videoType } from "@/pages/Home";
import { createSlice,  PayloadAction } from "@reduxjs/toolkit";


interface playlistType {
    name: string,
    description: string,
    owner: string
    videos: Array<videoType>
}

interface initialStateType {
    currentPlaylist: playlistType | null,
}

const initialState: initialStateType = {
    currentPlaylist: null
}

const playlistSlice = createSlice({
    name: "Playlist",
    initialState,
    reducers: {
        MakePlaylist: (state, action: PayloadAction<playlistType>) => {
            state.currentPlaylist = action.payload
        },

        endPlaylist: (state) => {
            state.currentPlaylist = null;
        }
    }
})


export const { MakePlaylist, endPlaylist } = playlistSlice.actions;

export default playlistSlice.reducer;