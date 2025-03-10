import { userService } from "../../services/user.service.js"
import { CLEAR_CART, TOGGLE_CART_IS_SHOWN } from "../reducers/toy.reducer.js"
import { SET_USER, SET_USER_SCORE } from "../reducers/user.reducer.js"
import { store } from "../store.js"

export function login(credentials) {
    return userService.login(credentials)
        .then(user => {
            console.log("login user",user)
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.log('user actions -> Cannot login', err)
            throw err
        })
}


export function signup(credentials) {
    return userService.signup(credentials)
        .then(user => {
            console.log(" signup user",user)
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.log('user actions -> Cannot signup', err)
            throw err
        })
}


export function logout() {
    return userService.logout()
        .then(() => {
            console.log(" logout user",user)
            store.dispatch({ type: SET_USER, user: null })
        })
        .catch((err) => {
            console.log('user actions -> Cannot logout', err)
            throw err
        })
}

export function addtobalance(diff){
    return userService.updateBalance(diff)
        .then(newScore => {
            console.log(`addtobalance ${diff} newScore`, newScore)
            store.dispatch({ type: SET_USER_SCORE, balance: newScore })
        })
        .catch((err) => {
            console.log('user actions -> Cannot checkout', err)
            throw err
        })
}

export function updateuser(user, activityTxt) {
    // const type = user._id ? UPDATE_TOY : ADD_TOY
    // console.log("toy txt",toy.txt,"toy isDone",toy.isDone)
    
    return userService.updateUser(user,activityTxt)
        .then((savedUser) => {
            // console.log("savedToy txt",savedToy.txt,"savedToy isDone",savedToy.isDone)
            store.dispatch({ type: SET_USER, user: savedUser})
            return savedUser
        })
        .catch(err => {
            console.log('user action -> Cannot save user', err)
            throw err
        })
}

export function checkout(diff) {
    return userService.updateScore(-diff)
        .then(newScore => {
            store.dispatch({ type: SET_USER_SCORE, balance: newScore })
            store.dispatch({ type: CLEAR_CART })
            store.dispatch({ type: TOGGLE_CART_IS_SHOWN })
        })
        .catch((err) => {
            console.log('user actions -> Cannot checkout', err)
            throw err
        })
}
