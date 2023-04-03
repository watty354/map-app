import { createSlice } from '@reduxjs/toolkit'

//初期値
const initialState  = {
    clips: [],
    emial: '',
    password: ''
  }

// 処理（Action）
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
		//追加
    addClip: (state, action) => {
        const newClip = action.payload;
        state.clips.push(newClip);
    },
		//削除
    deleteClip: (state, action) => {
        const deletingClip = action.payload;
        const currentClip = state.clips;
        const filteredClips = currentClip.filter((clip) => clip.url !== deletingClip.url);
        state.clips = filteredClips;
    },
    storeEmail: (state, action) => {
        const email = action.payload;
        state.email = email;
    },
    storePass: (state, action) => {
        const pass = action.payload;
        state.password = pass;
    }

  },
})

// 処理（Action）を定義
export const { addClip, deleteClip, storeEmail, storePass} = userSlice.actions

// 名前のやつでね〜
export default userSlice.reducer