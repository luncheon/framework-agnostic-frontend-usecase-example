import { NgModule } from '@angular/core'
import { RangePipe } from './range.pipe'
import { AutoFocusDirective } from './auto-focus.directive'

@NgModule({
  declarations: [
    AutoFocusDirective,
    RangePipe,
  ],
  exports: [
    AutoFocusDirective,
    RangePipe,
  ],
})
export class SharedModule {}
