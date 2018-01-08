import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
const name = new FormControl('', Validators.required);
const phone = new FormControl('', Validators.required);

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public form: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group( {
      name: name,
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      phone: phone,
      password: password,
      confirmPassword: confirmPassword
    } );
  }

  onSubmit() {
    this.router.navigate( ['/dashboard'] );
  }
}
