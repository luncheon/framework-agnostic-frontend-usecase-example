import produce from 'immer'
import React from 'react'
import { Worksheet, WorksheetOperations } from '../../../usecase'
import createWorksheet from '../../common/createWorksheet'
import createWorksheetKeyEventHandler from '../../common/createWorksheetKeyEventHandler'

const mapRangeInclusive: <T>(max: number, callback: (n: number) => T) => T[] =
  (max, callback) => {
    const result = Array(max + 1)
    for (let i = 0; i <= max; i++) {
      result[i] = callback(i)
    }
    return result
  }

const WorksheetCell: React.SFC<{
  rowIndex: number
  columnIndex: number
  active: boolean
  content?: string
}> = ({ rowIndex, columnIndex, active, content }) => (
  <td
    className={active ? 'active' : ''}
    data-row-index={rowIndex}
    data-column-index={columnIndex}
  >
    {active ? <input defaultValue={content} autoFocus /> : content}
  </td>
)
const WorksheetCellMemoized = React.memo(WorksheetCell)

const WorksheetRow: React.SFC<{
  rowIndex: number
  row?: string[]
  activeCellIndex?: number
  maxColumnIndex: number
}> = ({ rowIndex, row, activeCellIndex, maxColumnIndex }) => (
  <tr>
    <th>{rowIndex}</th>
    {
      mapRangeInclusive(maxColumnIndex, columnIndex => (
        <WorksheetCellMemoized
          key={columnIndex}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          active={columnIndex === activeCellIndex}
          content={row && row[columnIndex]}
        />
      ))
    }
  </tr>
)
const WorksheetRowMemoized = React.memo(WorksheetRow)

const WorksheetTableHeader: React.SFC<{
  maxColumnIndex: number
}> = ({ maxColumnIndex }) => (
  <thead>
    <tr>
      <th></th>
      {mapRangeInclusive(maxColumnIndex, columnIndex => <th key={columnIndex}>{columnIndex}</th>)}
    </tr>
  </thead>
)

const WorksheetTable: React.SFC<{
  worksheet: Worksheet
  worksheetOperations: WorksheetOperations
}> = ({ worksheet: { maxCellAddress, activeCellAddress, cellContents }, worksheetOperations }) => (
  <table className='worksheet'>
    <WorksheetTableHeader maxColumnIndex={maxCellAddress.columnIndex} />
    <tbody
      onClick={React.useCallback(
        event => {
          const dataset = (event.target as HTMLElement).dataset
          worksheetOperations.setActiveCellAddress(+dataset.rowIndex!, +dataset.columnIndex!)
        },
        []
      )}
      onChange={React.useCallback(
        event => {
          if (event.target instanceof HTMLInputElement) {
            worksheetOperations.setActiveCellContent(event.target.value)
          }
        },
        []
      )}
    >
      {
        mapRangeInclusive(maxCellAddress.rowIndex, rowIndex => (
          <WorksheetRowMemoized
            key={rowIndex}
            rowIndex={rowIndex}
            row={cellContents[rowIndex]}
            activeCellIndex={rowIndex === activeCellAddress.rowIndex ? activeCellAddress.columnIndex : undefined}
            maxColumnIndex={maxCellAddress.columnIndex}
          />
        ))
      }
    </tbody>
  </table>
)
const WorksheetTableMemoized = React.memo(WorksheetTable)

export default () => {
  const [state, setState] = React.useState(createWorksheet())
  const worksheetOperations = new WorksheetOperations(
    mutate => setState(produce(mutate))
  )
  React.useEffect(() => {
    const handleKeyDown = createWorksheetKeyEventHandler(worksheetOperations)
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  return (
    <WorksheetTableMemoized
      worksheet={state}
      worksheetOperations={worksheetOperations}
    />
  )
}
