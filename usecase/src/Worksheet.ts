export interface WorksheetCellAddress {
  rowIndex: number
  columnIndex: number
}

export interface Worksheet {
  readonly maxCellAddress: Readonly<WorksheetCellAddress>
  activeCellAddress: {
    rowIndex: number
    columnIndex: number
  }
  cellContents: string[][]  // cellContents[rowIndex][columnIndex]: string
}

export const createEmptyWorksheet =
  ({ maxCellAddress }: Pick<Worksheet, 'maxCellAddress'>): Worksheet => ({
    maxCellAddress,
    activeCellAddress: { rowIndex: 0, columnIndex: 0 },
    cellContents: [],
  })
