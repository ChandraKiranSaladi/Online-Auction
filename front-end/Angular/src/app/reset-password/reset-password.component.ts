import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { adjustBlueprintForNewNode } from '@angular/core/src/render3/instructions';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  isLoading = true;
  isValidToken = false;
  token: string = '';
  passwordForm: FormGroup;
  forgotPassSub = false;
  reset_success = '';
  pass_error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('token')) {
        this.token = paramMap.get('token');
        this.authService.checkToken(this.token).subscribe(
          (data) => {
            this.isLoading = false;
            this.isValidToken = (data) ? true : false;
          },
          (err) => {
            this.isLoading = false;
          }
        );
      } else {
        this.isLoading = false;
      }
    });
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required]
    });
  }

  get p() { return this.passwordForm.controls; }

  resetPassword() {
    this.forgotPassSub = true;

    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.resetToken(this.token, this.p.password.value)
      .subscribe(
        data => {
          this.reset_success = data['message'];
          this.pass_error = '';
          this.isLoading = false;
          this.router.navigate(['login']);
        },
        error => {
          this.pass_error = error.message;
          this.reset_success = '';
          this.isLoading = false;
        });
  }
}
