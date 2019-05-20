import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core'
import { WorksheetService } from './worksheet.services'
import createWorksheetKeyEventHandler from '../../../common/createWorksheetKeyEventHandler'

@Component({
  selector: 'app-worksheet',
  template: `
    <table class="worksheet" *ngIf="worksheet$ | async as worksheet">
      <thead>
        <tr>
          <th></th>
          <th *ngFor="let columnIndex of worksheet.maxCellAddress.columnIndex + 1 | appRange">{{columnIndex}}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let rowIndex of worksheet.maxCellAddress.rowIndex + 1 | appRange">
          <th>{{rowIndex}}</th>
          <ng-container *ngFor="let columnIndex of worksheet.maxCellAddress.columnIndex + 1 | appRange">
            <ng-content *ngTemplateOutlet="cellTemplate; context: {
              rowIndex: rowIndex,
              columnIndex: columnIndex,
              active: rowIndex === worksheet.activeCellAddress.rowIndex && columnIndex === worksheet.activeCellAddress.columnIndex,
              content: worksheet.cellContents[rowIndex] && worksheet.cellContents[rowIndex][columnIndex] || ''
            }">
            </ng-content>
          </ng-container>
        </tr>
      </tbody>
    </table>

    <ng-template
      #cellTemplate
      let-rowIndex="rowIndex"
      let-columnIndex="columnIndex"
      let-active="active"
      let-content="content"
    >
      <td
        [attr.data-row-index]="rowIndex"
        [attr.data-column-index]="columnIndex"
        [class.active]="active"
        (click)="worksheetOperations.setActiveCellAddress(rowIndex, columnIndex)"
      >
        <input
          *ngIf="active else inactive"
          [value]="content"
          (input)="worksheetOperations.setActiveCellContent($event.target.value)"
          appAutoFocus
        >
        <ng-template #inactive>{{content}}</ng-template>
      </td>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorksheetComponent implements OnInit, OnDestroy {
  readonly worksheet$ = this._worksheet.worksheet$
  readonly worksheetOperations = this._worksheet.worksheetOperations
  private readonly _worksheetKeyEventHandler = createWorksheetKeyEventHandler(this.worksheetOperations)

  constructor(private readonly _worksheet: WorksheetService) {}

  ngOnInit() {
    window.addEventListener('keydown', this._worksheetKeyEventHandler)
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this._worksheetKeyEventHandler)
  }
}
