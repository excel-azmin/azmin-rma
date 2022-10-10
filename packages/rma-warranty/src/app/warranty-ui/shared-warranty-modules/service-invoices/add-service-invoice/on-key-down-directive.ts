import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[ctrlI]',
})
export class KeyDownDetectorDirective {
  @Output() ctrlI: EventEmitter<boolean> = new EventEmitter();
  constructor() {}

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (
      event.getModifierState &&
      event.getModifierState('Control') &&
      event.keyCode === 73
    ) {
      this.ctrlI.emit(true);
    }
  }
}
