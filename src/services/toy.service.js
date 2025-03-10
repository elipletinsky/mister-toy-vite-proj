import { utilService } from "./util.service.js"
import { storageService } from "./async-storage.service.js"

const TOY_KEY = "toyDB"


const existingLabels = [
    "On wheels",
    "Box game",
    "Art",
    "Baby",
    "Doll",
    "Puzzle",
    "Outdoor",
    "Battery Powered",
  ]

_createToys()
export const toyService = {
  query,
  get,
  remove,
  save,
  getEmptyToy,
  getDefaultFilter,
  getFilterFromSearchParams,
  getImportanceStats,
  existingLabels,
    
}
// For Debug (easy access from console):
window.cs = toyService

function query(filterBy = {}) {
  return storageService.query(TOY_KEY).then((toys) => {
    if (filterBy.name && filterBy.name !== "") {
      console.log("filterBy.name", filterBy.name)
      const regExp = new RegExp(filterBy.name, "i")
      console.log("regExp", regExp)
      toys = toys.filter((toy) => regExp.test(toy.name))
    }

    if (filterBy.selectIsInStock !== "") {
        if(filterBy.selectIsInStock === "in Stock"){
            toys = toys.filter((toy) => toy.inStock === true)
        }
        else{
            toys = toys.filter((toy) => toy.inStock === false)
        }
    }
    if (filterBy.label !== "All") {
      toys = toys.filter((toy) => toy.labels.includes(filterBy.label))
    }

    if(filterBy.sortedBy !== ""){
        toys = toys.sort((a,b)=>{
            if(filterBy.sortedBy === "name"){
            return a.name.localeCompare(b.name)
            }
            if(filterBy.sortedBy === "price"){
            return a.price - b.price
            }
            if(filterBy.sortedBy === "createdAt"){
            return a.createdAt - b.createdAt
            }
        })
    }

    if (filterBy.select) {
      switch (filterBy.select) {
        case "All":
          break
        case "Active":
          toys = toys.filter((toy) => toy.isDone === false)
          break

        case "Done":
          toys = toys.filter((toy) => toy.isDone === true)
          break

        default:
          break
      }
      //toys = toys.filter(toy => toy.isDone === filterBy.select)
    }

    return toys
  })
}

function get(toyId) {
  return storageService.get(TOY_KEY, toyId).then((toy) => {
    toy = _setNextPrevToyId(toy)
    return toy
  })
}

function remove(toyId) {
  return storageService.remove(TOY_KEY, toyId)
}

function save(toy) {
  if (toy._id) {
    // TOY - updatable fields
    toy.updatedAt = Date.now()
    return storageService.put(TOY_KEY, toy)
  } else {
    toy.createdAt = toy.updatedAt = Date.now()

    return storageService.post(TOY_KEY, toy)
  }
}

function getDefaultFilter() {
  return { name: "", sortedBy: "" ,selectIsInStock: "" ,label: "All" }
}

function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter()
  const filterBy = {}
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || ""
  }
  return filterBy
}

function getImportanceStats() {
  return storageService.query(TOY_KEY).then((toys) => {
    const toyCountByImportanceMap = _getToyCountByImportanceMap(toys)
    const data = Object.keys(toyCountByImportanceMap).map((speedName) => ({
      title: speedName,
      value: toyCountByImportanceMap[speedName],
    }))
    return data
  })
}
  
function getEmptyToy(name = "", labels =[]) {
  return { name, imgUrl: "", price: 0, labels, createdAt: "", inStock: true }
}

function _createToy(name, labels) {
  const toy = getEmptyToy(name, labels)
  toy._id = utilService.makeId()
  toy.imgUrl = `public/assets/img/toy-teddy-bear-baby-svgrepo-com.svg`
  toy.price = utilService.getRandomIntInclusive(10, 100)
  toy.inStock = utilService.getRandomIntInclusive(0, 1) ? true : false
  toy.createdAt =
    Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24)
  return toy
}

function _createToys() {
  let toys = utilService.loadFromStorage(TOY_KEY)
  if (!toys || !toys.length) {
    toys = []
    const names = [
      "Lego",
      "Barbie",
      "Hot Wheels",
      "Playmobil",
      "Fisher Price",
      "Nerf",
      "Play-Doh",
      "FurReal",
      "Transformers",
      "My Little Pony",
    ]
    
    for (let i = 0; i < 20; i++) {
      const name = names[utilService.getRandomIntInclusive(0, names.length - 1)]
      const maxSubarraySize = 4
      const labels = utilService.getRandomSubarray(existingLabels, maxSubarraySize)
      toys.push(
        _createToy(name + (i + 1), labels)
      )
    }
    utilService.saveToStorage(TOY_KEY, toys)
  }
}



function _setNextPrevToyId(toy) {
  return storageService.query(TOY_KEY).then((toys) => {
    const toyIdx = toys.findIndex((currToy) => currToy._id === toy._id)
    const nextToy = toys[toyIdx + 1] ? toys[toyIdx + 1] : toys[0]
    const prevToy = toys[toyIdx - 1] ? toys[toyIdx - 1] : toys[toys.length - 1]
    toy.nextToyId = nextToy._id
    toy.prevToyId = prevToy._id
    return toy
  })
}

function _getToyCountByImportanceMap(toys) {
  const toyCountByImportanceMap = toys.reduce(
    (map, toy) => {
      if (toy.importance < 3) map.low++
      else if (toy.importance < 7) map.normal++
      else map.urgent++
      return map
    },
    { low: 0, normal: 0, urgent: 0 }
  )
  return toyCountByImportanceMap
}

// function getCompletionPercentage(toys) {
//     if (toys.length === 0) return 0 // Prevent division by zero

//     const doneCount = toys.filter(toy => toy.isDone).length

//     return (doneCount / toys.length) * 100
// }

