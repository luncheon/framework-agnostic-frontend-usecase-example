export interface WorksheetCellAddress {
    rowIndex: number;
    columnIndex: number;
}
export interface Worksheet {
    readonly maxCellAddress: Readonly<WorksheetCellAddress>;
    activeCellAddress: {
        rowIndex: number;
        columnIndex: number;
    };
    cellContents: string[][];
}
export declare const createEmptyWorksheet: ({ maxCellAddress }: Pick<Worksheet, "maxCellAddress">) => Worksheet;
