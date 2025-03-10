import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { userService } from "../services/user.service.js"
import { ActivityList } from "../cmps/ActivityList.jsx"
import { updateuser } from "../store/actions/user.actions.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

export function UserDetails() {
  const [userToEdit, setUserToEdit] = useState(
    userService.getEmptyCredentials()
  )
  
  const [loaded, setLoaded] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    if (params.userId) {
      loadUser()
    } else {
      setLoaded(true)
    }
  }, [])

  function loadUser() {
    console.log("userToEdit", userToEdit)
    userService
      .getById(params.userId)
      .then((user) => {
        console.log("userToEdit", user)
        setUserToEdit(user)
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

    setUserToEdit((prevUserToEdit) => ({ ...prevUserToEdit, [field]: value }))
  }

  function onSaveUser(ev) {
    ev.preventDefault()
    console.log("userToEdit", userToEdit)
    updateuser(userToEdit)
      .then(() => {
        showSuccessMsg("User Saved!")
        navigate("/toy")
      })
      .catch((err) => {
        console.log("Had issues saving User", err)
        showErrorMsg("Had issues saving User")
      })
  }

  const {
    fullname,
    backgroundColor = "#ffe4c4",
    txtColor,
    activities,
  } = userToEdit
  if (!loaded) return <div>Loading...</div>
  return (
    <section className="user-details">
      <section className="user-preferences">
        <form
          onSubmit={onSaveUser}
          style={{ backgroundColor: backgroundColor, color: txtColor }}
        >
          <label htmlFor="fullname">Name:</label>
          <input
            onChange={handleChange}
            value={fullname}
            type="text"
            name="fullname"
            id="fullname"
          />

          <label htmlFor="backgroundColor">Background Color:</label>
          <input
            onChange={handleChange}
            value={backgroundColor}
            type="color"
            name="backgroundColor"
            id="backgroundColor"
          />

          <label htmlFor="txtColor">Text Color:</label>
          <input
            onChange={handleChange}
            value={txtColor}
            type="color"
            name="txtColor"
            id="txtColor"
          />

          <button>Save</button>
        </form>
      </section>
      <section className="user-activities-list">
        {activities ? (
          <div>
            <h2> user's activities</h2>
            <ActivityList
              activities={activities}
              backgroundColor={backgroundColor}
              txtColor={txtColor}
            />
          </div>
        ) : (
          <div>Loading..</div>
        )}
      </section>
    </section>
  )
}
