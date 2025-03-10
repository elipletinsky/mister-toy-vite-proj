import { useState, useEffect, useRef } from "react"
import { debounce } from "../services/util.service.js"
import { PropTypes } from "prop-types"

export function ToyFilter({ filterBy, onSetFilter }) {
  ToyFilter.propTypes = {
    filterBy: PropTypes.object.isRequired,
    onSetFilter: PropTypes.func.isRequired,
  }

  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
  onSetFilter = useRef(debounce(onSetFilter)).current
  useEffect(() => {
    onSetFilter(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    switch (target.type) {
      case "number":
      case "range":
        value = +value || ""
        break

      case "checkbox":
        value = target.checked
        break

      default:
        break
    }

    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
  }

  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilter(filterByToEdit)
  }
  const selectInStockFilter = ["", "in Stock", "Out of Stock"]
  const selectSortingBy = ["", "name", "price", "createdAt"]
  const labels = [
    "On wheels",
    "Box game",
    "Art",
    "Baby",
    "Doll",
    "Puzzle",
    "Outdoor",
    "Battery Powered",
  ]
  const { name, sortedBy, selectIsInStock, label } = filterByToEdit

  return (
    <section className="toy-filter">
      <h2>Filter Toys</h2>
      <form onSubmit={onSubmitFilter}>
        <input
          value={name}
          onChange={handleChange}
          type="search"
          placeholder="By Name"
          id="txt"
          name="name"
        />

        <label htmlFor="sortedBy">filter by</label>
        <select
          value={sortedBy}
          onChange={handleChange}
          name="sortedBy"
          id="sortedBy"
        >
          {selectSortingBy.map((item) => (
            <option key={item} value={item}>
              {item === "" ? "No Sorting" : item}
            </option>
          ))}
        </select>

        <label htmlFor="selectIsInStock"> In Stock </label>
        <select
          value={selectIsInStock}
          onChange={handleChange}
          name="selectIsInStock"
          id="selectIsInStock"
        >
          {selectInStockFilter.map((item) => (
            <option key={item} value={item}>
              {item === "" ? "All" : item}
            </option>
          ))}
        </select>
        <label htmlFor="label"> filter by label </label>
        <select value={label} onChange={handleChange} name="label" id="label">
          <option value="All">All</option>
          {labels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
        <button hidden>Set Filter</button>
      </form>
    </section>
  )
}
