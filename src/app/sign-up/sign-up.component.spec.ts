import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent], // Import standalone component
      providers: [
        provideHttpClient(),
        importProvidersFrom(ReactiveFormsModule)
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display full name when form values change', () => {
    const firstNameInput = component.signUpForm.controls['firstName'];
    const lastNameInput = component.signUpForm.controls['lastName'];

    firstNameInput.setValue('Manesh');
    lastNameInput.setValue('Kumar');
    fixture.detectChanges();

    expect(component.fullName).toBe('Manesh Kumar');
  });
});
