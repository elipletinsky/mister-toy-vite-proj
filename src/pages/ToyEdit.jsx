import { toyService } from "../services/toy.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveToy } from "../store/actions/toy.actions.js"
import { updateuser } from "../store/actions/user.actions.js"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

export function ToyEdit() {
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy())
  const [newLabel, setNewLabel] = useState("")
  const [possibleLabels, setPossibleLabels] = useState(toyService.existingLabels)
  const [missingFields, setMissingFields] = useState([])
  const [loaded, setLoaded] = useState(false)
  const navigate = useNavigate()
  const params = useParams()
  // console.log("toyToEdit",toyToEdit)
  useEffect(() => {
    if (params.toyId) {
      loadToy()
    } else {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (newLabel) console.log("newLabel", newLabel)
  }, [newLabel])

  function loadToy() {
    toyService
      .get(params.toyId)
      .then((toy) => {
        setToyToEdit(toy)
        console.log("toy", toy)
        setPossibleLabels(
            (prevPosibleLabels) => prevPosibleLabels.filter(
            (label) => !toy.labels.includes(label)
          )
        )
        setLoaded(true)
      })
      .catch((err) => console.log("err:", err))
  }

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

    setToyToEdit((prevToyToEdit) => ({ ...prevToyToEdit, [field]: value }))
  }

  function onSaveToy(ev) {
    ev.preventDefault()
    console.log("toyToEdit", toyToEdit)

    if (!checkFormValidity()) {
      return
    }

    saveToy(toyToEdit)
      .then(() => {
        showSuccessMsg("Toy Saved!")
        if (user) updateuser(user, `added ${toyToEdit.txt}`)
        navigate("/toy")
      })
      .catch((err) => {
        console.log("Had issues saving Toy", err)
        showErrorMsg("Had issues saving Toy")
      })
  }

  function checkFormValidity() {
    const {
      name, price, inStock, labels, imgUrl
    } = toyToEdit
    const missing = []
    console.log("checkFormValidity:")
    setMissingFields(missing)
    if (!name) missing.push("name")
    if (!price) missing.push("price")
    if (!inStock) missing.push("inStock")
    if (!labels.length) missing.push("labels")
    if (!imgUrl) missing.push("imgUrl")
    

    if (missing.length) {
      console.log("missing:", missing)
      setMissingFields(missing)
      return false
    } else {
      return true
    }
  }
  function addLabel() {
    if (newLabel && newLabel !== "") {
      setToyToEdit((prevToy) => ({
        ...prevToy,
        labels: [...prevToy.labels, newLabel],
      }))
      setNewLabel("")
      console.log("addLabel newLabel", newLabel)
      console.log("addLabel posibleLabels", possibleLabels)
      setPossibleLabels((prevPosibleLabels) =>
        prevPosibleLabels.filter((label) => label !== newLabel)
      )
    }
  }

  const {
    name, price, inStock, imgUrl
  } = toyToEdit
  if (!loaded) return <div>Loading...</div>
  return (
    <section className="toy-edit">
      <form onSubmit={onSaveToy}>
        <label htmlFor="name">Name:</label>
        <input
          onChange={handleChange}
          value={name}
          type="text"
          name="name"
          id="name"
        />

        <label htmlFor="price">Price:</label>
        <input
          onChange={handleChange}
          value={price}
          type="number"
          name="price"
          id="price"
        />

        <label htmlFor="inStock">In Stock:</label>
        <input
          onChange={handleChange}
          checked={!!inStock}
          type="checkbox"
          name="inStock"
          id="inStock"
        />

          <label> add label </label>
          <select
            onChange={(event) => setNewLabel(event.target.value)}
            name="label"
            id="label"
          >
            <option value="">Select Label</option>
            {possibleLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <label htmlFor="thumbnail">img Url</label>
                <textarea className="Url-input" value={imgUrl} onChange={handleChange} type="url" name="thumbnail" id="thumbnail" />

          <button type="button" onClick={addLabel} disabled={newLabel === ""}>
            Add Label
          </button>
          <div>
            {toyToEdit.labels &&
              toyToEdit.labels.map((category) => (
                <span key={category}> {category},</span>
              ))}
          </div>

        <button>Save</button>
      </form>
    </section>
  )
}
