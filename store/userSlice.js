import { createSlice } from '@reduxjs/toolkit'

//初期値
const initialState  = {
    clips: [],
    userId: '',
    emial: '',
    password: '',
    displayName: '',
    displayImage: '',
    blockUsers: [],
    matchId: [],
  }

// 処理（Action）
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    storeUserId: (state, action) => {
        const userId = action.payload;
        state.userId = userId;
    },
    storeEmail: (state, action) => {
        const email = action.payload;
        state.email = email;
    },
    storePass: (state, action) => {
        const pass = action.payload;
        state.password = pass;
    },
    storeName: (state, action) => {
        const name = action.payload;
        state.displayName = name;
    },
    storeImage: (state, action) => {
        const image = action.payload;
        state.displayImage = image;
    },
    storeBlockUsers: (state, action) => {
        const blockUser = action.payload;
        if (!state.blockUsers) {
          state.blockUsers = [];
        }
        state.blockUsers.push(blockUser);
        // state.displayImage = blockUser;
    },
    storeMatchId: (state, action) => {
        const matchId = action.payload;
        if (!state.matchId) {
          state.matchId = [];
        }
        state.matchId.push(matchId);
    },


  },
})

// 処理（Action）を定義
export const { storeUserId, storeName, storeImage, storeEmail, storePass, storeBlockUsers, storeMatchId} = userSlice.actions

// 名前のやつでね〜
export default userSlice.reducer