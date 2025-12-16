import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: ` {{ 'hello + tooi teent la minh ' + value }} `,
})
export class nameValue {
  value: string = 'hello the world ';
  constructor() {
    console.log(this.value);
  }
}
