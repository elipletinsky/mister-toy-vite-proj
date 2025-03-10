import { ToyPreview } from "./ToyPreview.jsx"
import { PropTypes } from "prop-types"
export function ToyList({ toys, onRemoveToy }) {
  ToyList.propTypes = {
    toys: PropTypes.array.isRequired,
  }
  return (
    <ul className="toy-list">
      {toys.map((toy) => (
        <li key={toy._id}>
          <ToyPreview
            toy={toy}
            onRemoveToy={() => onRemoveToy(toy._id, toy.name)}
          />
        </li>
      ))}
    </ul>
  )
}
