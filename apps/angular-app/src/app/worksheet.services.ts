import { Injectable } from '@angular/core'
import produce from 'immer'
import { BehaviorSubject } from 'rxjs'
import { Worksheet, WorksheetOperations } from '../../../../usecase'
import createWorksheet from '../../../common/createWorksheet'

@Injectable()
export class WorksheetService {
  private readonly _worksheet = new BehaviorSubject<Worksheet>(createWorksheet())
  readonly worksheetOperations = new WorksheetOperations(
    mutate => this._worksheet.next(produce(this._worksheet.value, mutate))
  )
  readonly worksheet$ = this._worksheet.asObservable()
}
