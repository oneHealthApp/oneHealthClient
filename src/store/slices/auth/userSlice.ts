import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    id?: string
    avatar?: string
    username?: string
    emailId?: string
    fullName?: string
    roles?: Array<{
        roleId: string
        roleName: string
        roleCategory: string | null
    }>
    authority?: string[]
}

const initialState: UserState = {
    id: '',
    avatar: '',
    username: '',
    emailId: '',
    fullName: '',
    roles: [],
    authority: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.id = action.payload?.id
            state.avatar = action.payload?.avatar
            state.emailId = action.payload?.emailId
            state.username = action.payload?.username
            state.fullName = action.payload?.fullName
            state.roles = action.payload?.roles
            state.authority = action.payload?.authority
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
