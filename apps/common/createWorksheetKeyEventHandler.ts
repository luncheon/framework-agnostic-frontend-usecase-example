import { WorksheetOperations } from '../../usecase'

export default (operations: WorksheetOperations) => (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      operations.moveActiveCellAddress(1)
      break
    case 'ArrowLeft':
      event.preventDefault()
      operations.moveActiveCellAddress(0, -1)
      break
    case 'ArrowRight':
      event.preventDefault()
      operations.moveActiveCellAddress(0, 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      operations.moveActiveCellAddress(-1)
      break
    case 'Tab':
      event.preventDefault()
      operations.moveActiveCellAddress(0, event.shiftKey ? -1 : 1)
      break
    case 'Enter':
      event.preventDefault()
      operations.moveActiveCellAddress(event.shiftKey ? -1 : 1)
      break
    default:
      break
  }
}
