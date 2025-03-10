import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getBaseUrl } from "../services/util.service.js"
import { PropTypes } from "prop-types"

export function ToyPreview({ toy, onRemoveToy }) {
  ToyPreview.propTypes = {
    toy: PropTypes.object.isRequired,
  }
  const [inStock, setInStock] = useState(toy.inStock)
  const navigate = useNavigate()
  const toyPreviewRef = useRef(null)

  // console.log('toy.imgUrl', toy.imgUrl)

  function statusColor(isInStock) {
    return isInStock
      ? { color: "#006A4E", backgroundColor: "#ACE1AF" }
      : { color: "#AA0000", backgroundColor: "#fd5c63" }
  }

  function getReleventDate() {
    if (toy.updatedAt > toy.createdAt)
      return "updated: " + new Date(toy.updatedAt).toISOString().split("T")[0]
    else {
      return "created: " + new Date(toy.createdAt).toISOString().split("T")[0]
    }
  }

  function handleMouseEnter() {
    if (toyPreviewRef.current) {
      toyPreviewRef.current.style.borderColor = "var(--clr1)"
    }
  }

  function handleMouseLeave() {
    if (toyPreviewRef.current) {
      toyPreviewRef.current.style.borderColor = "transparent"
    }
  }

  return (
    <div
      className="toy-preview"
      style={{ backgroundColor: toy.backgroundColor, color: toy.txtColor }}
      ref={toyPreviewRef}
    >
      <button className="preview-remove" onClick={onRemoveToy}>
        x
      </button>
      <button
        className="preview-edit"
        onClick={(e) => {
          e.stopPropagation()
          navigate(`/toy/edit/${toy._id}`)
        }}
      >
        ...
        {/* <Link to={`/toy/edit/${toy._id}`}>...</Link> */}
      </button>

      <span
        className="preview-title"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link to={`/toy/${toy._id}`}>
          <h2>{toy.name}</h2>
        </Link>
      </span>
      <span className="preview-in-stock" style={statusColor(inStock)}>
        {inStock ? "In Stock" : "Out of Stock"}
      </span>
      <span className="preview-price">{toy.price}$</span>
      <span className="preview-labels"> {toy.labels.join(", ")}</span>
      <span className="preview-date">{getReleventDate()}</span>
      <img src={getBaseUrl()+"/"+toy.imgUrl} alt="" />
    </div>
  )
}
