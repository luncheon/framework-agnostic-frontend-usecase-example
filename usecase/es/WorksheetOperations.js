export class WorksheetOperations {
    constructor(update) {
        this.update = update;
    }
    setActiveCellAddress(rowIndex, columnIndex) {
        this.update(({ maxCellAddress, activeCellAddress }) => {
            if (typeof rowIndex === 'number' && rowIndex >= 0 && rowIndex <= maxCellAddress.rowIndex) {
                activeCellAddress.rowIndex = rowIndex;
            }
            if (typeof columnIndex === 'number' && columnIndex >= 0 && columnIndex <= maxCellAddress.columnIndex) {
                activeCellAddress.columnIndex = columnIndex;
            }
        });
        return this;
    }
    moveActiveCellAddress(rowOffset, columnOffset) {
        this.update(({ maxCellAddress, activeCellAddress }) => {
            if (typeof rowOffset === 'number' && rowOffset) {
                activeCellAddress.rowIndex = Math.min(Math.max(0, activeCellAddress.rowIndex + rowOffset), maxCellAddress.rowIndex);
            }
            if (typeof columnOffset === 'number' && columnOffset) {
                activeCellAddress.columnIndex = Math.min(Math.max(0, activeCellAddress.columnIndex + columnOffset), maxCellAddress.columnIndex);
            }
        });
        return this;
    }
    setActiveCellContent(content) {
        this.update(({ activeCellAddress: { rowIndex, columnIndex }, cellContents }) => {
            if (content) {
                cellContents[rowIndex] = cellContents[rowIndex] || [];
                cellContents[rowIndex][columnIndex] = content;
            }
            else {
                const row = cellContents[rowIndex];
                if (!row || !row[columnIndex]) {
                    return;
                }
                delete cellContents[rowIndex][columnIndex];
                while (row.length && !row[row.length - 1]) {
                    row.pop();
                }
                if (row.length) {
                    return;
                }
                delete cellContents[rowIndex];
                while (cellContents.length && !cellContents[cellContents.length - 1]) {
                    cellContents.pop();
                }
            }
        });
        return this;
    }
}
