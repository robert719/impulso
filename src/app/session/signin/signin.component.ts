import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {AuthService} from "../../services/auth.service";
import {IntegrationsService} from "../../services/integrations.service";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],

})
export class SigninComponent implements OnInit {

    public form: FormGroup;

    loading = false;
    showError = false;

    constructor(private fb: FormBuilder, private router: Router, private _authService: AuthService, private _integrationsService: IntegrationsService) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            username: [null, Validators.compose([Validators.required, CustomValidators.email])],
            password: [null, Validators.compose([Validators.required])]
        });
    }

    onSubmit(value) {
        this.loading = true;
        this._authService.signIn(value)
            .subscribe(
                data => {

                    if (data.error) {
                        this.showError = true;
                        this.loading = false;
                    } else {
                        localStorage.setItem('token', data.access_token);
                        this._authService.getCompany()
                            .subscribe(
                                companyRes => {
                                    // console.log(companyRes);
                                    localStorage.setItem('userId', companyRes.company.id);
                                    localStorage.setItem('companyName', companyRes.company.name);
                                    localStorage.setItem('companyLogo', companyRes.company.logo);
                                    this.router.navigate(['/home']);
                                },
                                error => console.log(error)
                            );
                        this._integrationsService.getIntegrations()
                            .subscribe(
                                integrationsRes => {
                                    localStorage.setItem('integrations', JSON.stringify(integrationsRes));
                                },
                                error => console.log(error)
                            );
                    }
                },
                error => {
                    console.log(error);
                    this.loading = false;
                }
            );
    }

}
