import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  passwordForm: FormGroup;
  loading = false;
  forgotPassword = false;
  submitted = false;
  register = false;
  forgotPassSub = false;
  reset_success = '';
  returnUrl: string;
  error = '';
  register_error = '';
  pass_error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.passwordForm = this.formBuilder.group({
      email: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error.message;
          this.loading = false;
        });
  }

  get r() { return this.registerForm.controls; }

  onRegister() {
    this.register = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.register(this.r.firstname.value, this.r.lastname.value, this.r.email.value, this.r.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.register_error = error.message;
          this.loading = false;
        });
  }

  get p() { return this.passwordForm.controls; }

  onForgotPassword() {
    this.forgotPassSub = true;

    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.forgotPassword(this.p.email.value)
      .pipe(first())
      .subscribe(
        data => {
          this.reset_success = data['message'];
          this.loading = false;
        },
        error => {
          this.pass_error = error.message;
          this.loading = false;
        });
  }
}
