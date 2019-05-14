import { Worksheet } from './Worksheet';
export declare class WorksheetOperations {
    private readonly update;
    constructor(update: (mutate: (state: Worksheet) => void) => unknown);
    setActiveCellAddress(rowIndex?: number, columnIndex?: number): this;
    moveActiveCellAddress(rowOffset?: number, columnOffset?: number): this;
    setActiveCellContent(content?: string): this;
}
