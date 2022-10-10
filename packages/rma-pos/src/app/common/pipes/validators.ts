import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export function ValidateInputSelected(
  formControl: FormControl,
  options: Observable<any[]>,
) {
  options.pipe(debounceTime(1000)).subscribe({
    next: (data: any[]) => {
      if (!data) return;
      if (typeof formControl.value === 'object') {
        return true;
      }
      if (data.includes(formControl.value)) {
        return true;
      }
      if (typeof data[0] !== 'string') {
        let result = false;
        data.forEach(obj => {
          if (Object.keys(obj).find(key => obj[key] === formControl.value)) {
            result = true;
          }
        });
        if (result) {
          formControl.setErrors({ falseValse: null });
          formControl.updateValueAndValidity();
          return;
        }
      }
      formControl.setErrors({ falseValse: formControl.value });
    },
  });
}
