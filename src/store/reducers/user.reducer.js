import { userService } from "../../services/user.service.js"

//* Count
export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const CHANGE_BY = 'CHANGE_BY'

//* User
export const SET_USER = 'SET_USER'
export const UPDATE_USER = 'UPDATE_USER'
export const SET_USER_SCORE = 'SET_USER_SCORE'


const initialState = {
    count: 101,
    loggedInUser: userService.getLoggedinUser(),
}

export function userReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_USER:
            return {
                ...state,
                loggedInUser: cmd.user
            }
        // case UPDATE_USER:
        //     return {
        //         ...state,
        //         toys: state.toys.map(toy => toy._id === cmd.toy._id ? cmd.toy : toy)
        //     }
        case INCREMENT:
            return {
                ...state,
                count: state.count + 1
            }
        case DECREMENT:
            return {
                ...state,
                count: state.count - 1
            }
        case CHANGE_BY:
            return {
                ...state,
                count: state.count + cmd.diff
            }
        case SET_USER_SCORE:
            const loggedInUser = { ...state.loggedInUser, balance: cmd.balance }
            return { ...state, loggedInUser }
        default:
            return state

    }
}
