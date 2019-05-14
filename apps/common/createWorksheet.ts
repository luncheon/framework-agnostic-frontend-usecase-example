import { createEmptyWorksheet } from '../../usecase'

export default () => createEmptyWorksheet({
  maxCellAddress: {
    rowIndex: 99,
    columnIndex: 99,
  }
})
