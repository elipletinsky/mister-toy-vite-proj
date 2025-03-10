import { toyService } from "../../services/toy.service.js";
import { ADD_TOY, REMOVE_TOY, SET_TOYS, SET_IS_LOADING, UNDO_TOYS, UPDATE_TOY,SET_PRECENT_OF_DONE } from "../reducers/toy.reducer.js";
import { store } from "../store.js";
//car
export function loadToys() {
    const filterBy = store.getState().toyModule.filterBy
    getCompletionPercentage()
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return toyService.query(filterBy)
        .then(toys => {
            // console.log("toys:", toys)
            // getCompletionPercentage(toys)
            store.dispatch({ type: SET_TOYS, toys })
        })
        .catch(err => {
            console.log('toy action -> Cannot load toys', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        })
}

export function removeToyOptimistic(toyId) {
    store.dispatch({ type: REMOVE_TOY, toyId })
    getCompletionPercentage()
    return toyService.remove(toyId)
        .catch(err => {
            store.dispatch({ type: UNDO_TOYS })
            console.log('toy action -> Cannot remove toy', err)
            throw err
        })
}

export function removeToy(toyID) {
    return toyService.remove(toyID)
        .then(() => {
            store.dispatch({ type: REMOVE_TOY, toyID })
            getCompletionPercentage()
        })
        .catch(err => {
            console.log('toy action -> Cannot remove toy', err)
            throw err
        })
}


export function saveToy(toy) {
    const type = toy._id ? UPDATE_TOY : ADD_TOY
    // console.log("toy txt",toy.txt,"toy isDone",toy.isDone)
    
    return toyService.save(toy)
        .then((savedToy) => {
            // console.log("savedToy txt",savedToy.txt,"savedToy isDone",savedToy.isDone)
            store.dispatch({ type, toy: savedToy })
            getCompletionPercentage()
            return savedToy
        })
        .catch(err => {
            console.log('toy action -> Cannot save toy', err)
            throw err
        })
}

export function getCompletionPercentage() {
    const toys = store.getState().toyModule.toys
    if (toys.length === 0){
        return
    } 
    const doneCount = toys.filter(toy => toy.isDone).length;
    
    const percentOfDone = (((doneCount / toys.length) * 100)).toFixed(2);
    // console.log("percentOfDone",percentOfDone)
    // console.log("toys.length/doneCount",toys.length,doneCount )
    store.dispatch({ type: SET_PRECENT_OF_DONE, percentOfDone })
}