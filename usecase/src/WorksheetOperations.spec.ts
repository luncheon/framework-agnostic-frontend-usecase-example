import produce from 'immer'
import { Worksheet, createEmptyWorksheet } from './Worksheet'
import { WorksheetOperations } from './WorksheetOperations'

const maxCellAddress = { rowIndex: 9999, columnIndex: 999 }
let state: Worksheet = createEmptyWorksheet({ maxCellAddress })
beforeEach(() => state = createEmptyWorksheet({ maxCellAddress }))

; [
  { description: 'direct', operations: new WorksheetOperations(mutate => mutate(state)) },
  { description: 'immer', operations: new WorksheetOperations(mutate => state = produce(state, mutate)) },
].forEach(({ description, operations }) => describe(description, () => {
  describe('setActiveCellAddress', () => {
    it('should set `activeCellAddress`', () => {
      operations.setActiveCellAddress(100, 200)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 100, columnIndex: 200 },
        cellContents: [],
      })

      operations.setActiveCellAddress(0, 0)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 0, columnIndex: 0 },
        cellContents: [],
      })
    })

    it('should not set row index when the value is `undefined`', () => {
      operations.setActiveCellAddress(100, 200)
      operations.setActiveCellAddress(undefined, 30)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 100, columnIndex: 30 },
        cellContents: [],
      })
    })

    it('should not set column index when the value is `undefined`', () => {
      operations.setActiveCellAddress(100, 200)
      operations.setActiveCellAddress(70, undefined)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 70, columnIndex: 200 },
        cellContents: [],
      })
    })

    it('should not set row index when the value is negative', () => {
      operations.setActiveCellAddress(100, 200)
      operations.setActiveCellAddress(-1, 40)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 100, columnIndex: 40 },
        cellContents: [],
      })
    })

    it('should not set column index when the value is negative', () => {
      operations.setActiveCellAddress(100, 200)
      operations.setActiveCellAddress(80, -1)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 80, columnIndex: 200 },
        cellContents: [],
      })
    })

    it('should not set row index when the value exceeds max', () => {
      operations.setActiveCellAddress(100, 200)
      operations.setActiveCellAddress(10000, 40)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 100, columnIndex: 40 },
        cellContents: [],
      })
      operations.setActiveCellAddress(9999, 50)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 9999, columnIndex: 50 },
        cellContents: [],
      })
    })

    it('should not set column index when the value exceeds max', () => {
      operations.setActiveCellAddress(100, 200)
      operations.setActiveCellAddress(80, 1000)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 80, columnIndex: 200 },
        cellContents: [],
      })
      operations.setActiveCellAddress(80, 999)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 80, columnIndex: 999 },
        cellContents: [],
      })
    })
  })

  describe('moveActiveCellAddress', () => {
    it('should move `activeCellAddress`', () => {
      operations.setActiveCellAddress(100, 200)
      operations.moveActiveCellAddress(-20, -30)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 80, columnIndex: 170 },
        cellContents: [],
      })
    })

    it('should not move row index when the value is `undefined`', () => {
      operations.setActiveCellAddress(100, 200)
      operations.moveActiveCellAddress(undefined, 30)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 100, columnIndex: 230 },
        cellContents: [],
      })
    })

    it('should not move column index when the value is `undefined`', () => {
      operations.setActiveCellAddress(100, 200)
      operations.moveActiveCellAddress(40, undefined)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 140, columnIndex: 200 },
        cellContents: [],
      })
    })

    it('should not be negative row index', () => {
      operations.setActiveCellAddress(100, 200)
      operations.moveActiveCellAddress(-101, 0)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 0, columnIndex: 200 },
        cellContents: [],
      })
    })

    it('should not be negative column index', () => {
      operations.setActiveCellAddress(100, 200)
      operations.moveActiveCellAddress(0, -201)
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 100, columnIndex: 0 },
        cellContents: [],
      })
    })
  })

  describe('setActiveCellContent', () => {
    it('should set content', () => {
      operations.setActiveCellContent('aaa')
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 0, columnIndex: 0 },
        cellContents: [['aaa']],
      })
    })

    it('should consider empty string as `undefined`', () => {
      operations.setActiveCellContent('')
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 0, columnIndex: 0 },
        cellContents: [],
      })
    })

    it('should set content on the active cell', () => {
      operations
        .setActiveCellAddress(3, 2)
        .setActiveCellContent('aaa')
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 3, columnIndex: 2 },
        cellContents: [
          undefined,
          undefined,
          undefined,
          [undefined, undefined, 'aaa'],
        ],
      })
    })

    it('should delete content when the content is `undefined`', () => {
      operations
        .setActiveCellAddress(1, 2)
        .setActiveCellContent('aaa')
        .moveActiveCellAddress(0, 1)
        .setActiveCellContent('bbb')
        .moveActiveCellAddress(0, 1)
        .setActiveCellContent('ccc')
        .moveActiveCellAddress(1, -1)
        .setActiveCellContent('ddd')
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 2, columnIndex: 3 },
        cellContents: [
          undefined,
          [undefined, undefined, 'aaa', 'bbb', 'ccc'],
          [undefined, undefined, undefined, 'ddd'],
        ],
      })
      operations
        .setActiveCellAddress(1, 3)
        .setActiveCellContent()
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 1, columnIndex: 3 },
        cellContents: [
          undefined,
          [undefined, undefined, 'aaa', undefined, 'ccc'],
          [undefined, undefined, undefined, 'ddd'],
        ],
      })
      operations
        .moveActiveCellAddress(0, 1)
        .setActiveCellContent()
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 1, columnIndex: 4 },
        cellContents: [
          undefined,
          [undefined, undefined, 'aaa'],
          [undefined, undefined, undefined, 'ddd'],
        ],
      })
      operations
        .moveActiveCellAddress(0, -2)
        .setActiveCellContent()
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 1, columnIndex: 2 },
        cellContents: [
          undefined,
          undefined,
          [undefined, undefined, undefined, 'ddd'],
        ],
      })
      operations
        .moveActiveCellAddress(1, 1)
        .setActiveCellContent()
      expect(state).toEqual({
        maxCellAddress,
        activeCellAddress: { rowIndex: 2, columnIndex: 3 },
        cellContents: [],
      })
    })
  })
}))
