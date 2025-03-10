import { toyService } from "../services/toy.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"
import { Chat } from "../cmps/Chat.jsx"
import { PopUp } from "../cmps/Popup.jsx"
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ToyPreview } from "../cmps/ToyPreview.jsx"

export function ToyDetails() {
  const [toy, setToy] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(true)
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadToy()
  }, [params.toyId])

  function loadToy() {
    toyService
      .get(params.toyId)
      .then(setToy)
      .catch((err) => {
        console.error("err:", err)
        showErrorMsg("Cannot load toy")
        navigate("/toy")
      })
  }

  function onBack() {
    // If nothing to do here, better use a Link
    navigate("/toy")
    // navigate(-1)
  }

  function statusColor(isInStock) {
    return isInStock
      ? { color: "#006A4E", backgroundColor: "#ACE1AF" }
      : { color: "#AA0000", backgroundColor: "#fd5c63" }
  }
  // const toy = {
  //     _id: "t101",
  //     name: "Talking Doll",
  //     imgUrl: "hardcoded-url-for-now",
  //     price: 123,
  //     labels: ["Doll", "Battery Powered", "Baby"],
  //     createdAt: 1631031801011,
  //     inStock: true,
  //   }

  if (!toy) return <div>Loading...</div>
  return (
    <section className="toy-details">
      <ToyPreview toy={toy} />
      <button onClick={onBack}>Back to list</button>
      <div>
        <Link to={`/toy/${toy.nextToyId}`}>Next Toy</Link> |
        <Link to={`/toy/${toy.prevToyId}`}>Previous Toy</Link>
      </div>
        <button onClick={() => setIsPopupOpen(true)}>Chat</button>
        {isPopupOpen && (
          <PopUp
            heading={<h2 style={{ alignContent: "center" }}>Chat</h2>}
            footing={
              <button onClick={() => setIsPopupOpen(false)}>Close</button>
            }
            onClose={() => setIsPopupOpen(false)}
          >
            <Chat />
          </PopUp>
        )}
    </section>
  )
}
