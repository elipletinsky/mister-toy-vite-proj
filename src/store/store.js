import { toyReducer } from "./reducers/toy.reducer.js"
import { userReducer } from "./reducers/user.reducer.js"
// import{ createStore, combineReducers, compose } from 'redux'
import { createStore, applyMiddleware, combineReducers}
from 'redux'

// const { createStore, combineReducers, compose } = Redux

const rootReducer = combineReducers({
    toyModule: toyReducer,
    userModule: userReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers())


window.gStore = store

// store.subscribe(() => {
//     console.log('Current state is:', store.getState())
// })
