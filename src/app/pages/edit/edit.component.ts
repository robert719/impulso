import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MdDialog, MdDialogRef, MdDialogConfig} from '@angular/material';
import {ConfirmComponent} from "../../shared/confirm.component";
import {ConfigService} from "../../services/config.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit{

  passwordForm: FormGroup;
  saving: boolean;

  systems = [{
    name: 'Modo Nocturno',
    on: false,
  }];

/*  systems: Object[] = [{
    name: 'Modo Nocturno',
    on: false,
  }, {
    name: 'Surround Sound',
    on: true,
  }, {
    name: 'T.V.',
    on: true,
  }, {
    name: 'Entertainment System',
    on: true,
  }, ];*/

  // Dialog para confirmar
  confirmRef: MdDialogRef<ConfirmComponent>;
  confirmConfig: MdDialogConfig = {
    disableClose: true,
    width: '80vw',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    }
  };

  constructor(private _authService: AuthService, public dialog: MdDialog, private _configService: ConfigService) {}

  ngOnInit() {
/*
    this._authService.getCompany()
        .subscribe(
            companyRes => {
              console.log(companyRes);
            },
            error => console.log(error)
        );
*/

    // Defino la estructura del formulario de ingreso/edición.
    this.passwordForm = new FormGroup({
      'currentPassword': new FormControl('', [Validators.required]),
      'newPassword': new FormControl('', [Validators.required]),
      'repeatPassword': new FormControl('', [Validators.required])
    });
  }

  getPasswordMessage() {
    if (this.passwordForm.controls['currentPassword'].value == this.passwordForm.controls['newPassword'].value && this.passwordForm.controls['currentPassword'].touched && this.passwordForm.controls['currentPassword'].value !== '') {
      return 'La nueva contraseña debe ser diferente a la actual.';
    } else if (this.passwordForm.controls['newPassword'].value != this.passwordForm.controls['repeatPassword'].value && this.passwordForm.controls['newPassword'].touched && this.passwordForm.controls['repeatPassword'].touched) {
      return 'Las contraseñas no coinciden.';
    }
  }

  formValid() {
    if (this.passwordForm.controls['currentPassword'].value == this.passwordForm.controls['newPassword'].value && this.passwordForm.controls['currentPassword'].touched && this.passwordForm.controls['currentPassword'].value !== '') {
      return false;
    } else if (this.passwordForm.controls['newPassword'].value != this.passwordForm.controls['repeatPassword'].value && this.passwordForm.controls['newPassword'].touched && this.passwordForm.controls['repeatPassword'].touched) {
      return false;
    } else {
      return true;
    }
  }

  formFilled() {
    if (this.passwordForm.controls['currentPassword'].touched && this.passwordForm.controls['newPassword'].touched && this.passwordForm.controls['repeatPassword'].touched) {
      if (this.passwordForm.controls['currentPassword'].value && this.passwordForm.controls['newPassword'].value && this.passwordForm.controls['repeatPassword'].value ) {
      return true;
      }
    } else {
      return false;
    }
  }

  saveConfig() {
    console.log(this.passwordForm.value);
    this.saving = true;
    this._authService.changePassword(this.passwordForm.controls['currentPassword'].value, this.passwordForm.controls['newPassword'].value)
        .subscribe(
            Res => {
              this.saving = false;
              Object.keys(this.passwordForm.controls).forEach(key => {
                this.passwordForm.get(key).reset();
              });
              const data = {
                title: 'Se ha cambiado tu contraseña',
                subtitle: '',
                ok: true,
                cancel: false
              };

              this.confirmConfig.data = data;
              this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
              this.confirmRef.afterClosed().subscribe(result => {
                this.confirmRef.close();
              });
            },
            error => {
              this.saving = false;
              const data = {
                title: 'No se pudo cambiar tu contraseña',
                subtitle: 'Por favor verifica los datos ingresados',
                ok: true,
                cancel: false
              };

              this.confirmConfig.data = data;
              this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
              this.confirmRef.afterClosed().subscribe(result => {
                this.confirmRef.close();
              });
            }
        );
  }

  changeConfig() {
    this._configService.changingConfig(this.systems);
  }
}
