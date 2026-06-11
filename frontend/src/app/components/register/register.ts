import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  email = '';
  password = '';
  passwordConfirmation = '';

  onSubmit(event: SubmitEvent, form: NgForm): void {
    event.preventDefault();

    if (form.invalid || this.password !== this.passwordConfirmation) {
      form.control.markAllAsTouched();
      return;
    }

    // The registration API is not connected yet.
  }
}
