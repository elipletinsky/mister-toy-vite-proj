import { ToyFilter } from "../cmps/ToyFilter.jsx"
import { ToyList } from "../cmps/ToyList.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadToys, removeToyOptimistic } from "../store/actions/toy.actions.js"
import { getTruthyValues } from "../services/util.service.js"
import { SET_FILTER_BY } from "../store/reducers/toy.reducer.js"
import { updateuser } from "../store/actions/user.actions.js"
import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

export function ToyIndex() {
  const toys = useSelector((storeState) => storeState.toyModule.toys)
  const filterBy = useSelector((storeState) => storeState.toyModule.filterBy)
  const isLoading = useSelector((storeState) => storeState.toyModule.isLoading)
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()

  useEffect(() => {
    setSearchParams(getTruthyValues(filterBy))
    loadToys().catch(() => showErrorMsg("cannot load toys"))
  }, [filterBy])

  function onRemoveToy(toyId, toyName) {
    if (confirm(`delete ${toyName}`)) {
      removeToyOptimistic(toyId)
        .then(() => {
          showSuccessMsg("Toy removed")
          if (user) updateuser(user, `removed ${toyName}`)
        })
        .catch(() => showErrorMsg("Cannot remove Toy"))
    }
  }

  function onSetFilter(filterBy) {
    dispatch({ type: SET_FILTER_BY, filterBy })
  }

  if (!toys) return <div>Loading...</div>
  return (
    <section className="toy-index">
      <ToyFilter filterBy={filterBy} onSetFilter={onSetFilter} />
      <div>
        <Link to="/toy/edit" className="btn">
          Add Toy
        </Link>
      </div>

      {!isLoading ? (
        <div>
          <h2>Toys List</h2>
          <ToyList toys={toys} onRemoveToy={onRemoveToy} />
        </div>
      ) : (
        <div>Loading..</div>
      )}
    </section>
  )
}
