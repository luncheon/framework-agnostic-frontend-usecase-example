import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'appRange' })
export class RangePipe implements PipeTransform {
  transform(end: number) {
    return [...Array(end)].map((_, index) => index)
  }
}
