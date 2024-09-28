import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailBreak'
})
export class EmailBreakPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace('@', '@<br>');
  }
}
