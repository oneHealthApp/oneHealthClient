import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export interface SessionState {
    signedIn: boolean
    accessToken: string | null
    refreshToken: string | null
    expiresIn: number | null
}

const initialState: SessionState = {
    signedIn: false,
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
}

const sessionSlice = createSlice({
    name: `${SLICE_BASE_NAME}/session`,
    initialState,
    reducers: {
        signInSuccess(state, action: PayloadAction<{
            accessToken: string
            refreshToken: string
            expiresIn: number
        }>) {
            state.signedIn = true
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            state.expiresIn = action.payload.expiresIn
        },
        signOutSuccess(state) {
            state.signedIn = false
            state.accessToken = null
            state.refreshToken = null
            state.expiresIn = null
        },
    },
})

export const { signInSuccess, signOutSuccess } = sessionSlice.actions
export default sessionSlice.reducer
