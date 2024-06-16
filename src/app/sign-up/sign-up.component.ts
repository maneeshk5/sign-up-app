import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  fullName: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z]).+$'),
        this.containsNameValidator()
      ]]
    });

    this.signUpForm.valueChanges.subscribe(values => {
      this.fullName = `${values.firstName} ${values.lastName}`;
    });
  }

  containsNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const firstName = this.signUpForm?.get('firstName')?.value || '';
      const lastName = this.signUpForm?.get('lastName')?.value || '';
      const forbidden = new RegExp(firstName, 'i').test(control.value) || new RegExp(lastName, 'i').test(control.value);
      return forbidden ? { containsName: true } : null;
    };
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const { firstName, lastName, email } = this.signUpForm.value;
      const lastNameLength = lastName.length;

      this.http.get(`https://jsonplaceholder.typicode.com/photos/${lastNameLength}`).pipe(
        map((data: any) => data.thumbnailUrl),
        switchMap(thumbnailUrl => this.http.post('https://jsonplaceholder.typicode.com/users', {
          firstName,
          lastName,
          email,
          thumbnailUrl
        }))
      ).subscribe(response => {
        console.log('User created successfully:', response);
      });
    }
  }
}
