export const createEmptyWorksheet = ({ maxCellAddress }) => ({
    maxCellAddress,
    activeCellAddress: { rowIndex: 0, columnIndex: 0 },
    cellContents: [],
});
