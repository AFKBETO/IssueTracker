import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth'

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss']
})
export class EmailLoginComponent implements OnInit {
  form!: FormGroup;
  type: 'login' | 'signup' | 'reset' = 'signup'
  loading = false
  serverMessage!: string

  constructor (private afAuth: Auth, private fb: FormBuilder) { }

  ngOnInit (): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8), Validators.maxLength(32), Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/), Validators.required]],
      passwordConfirm: ['', []]
    })
  }

  changeType (val: 'login' | 'signup' | 'reset') {
    this.type = val
  }

  get isLogin () {
    return this.type === 'login'
  }

  get isSignup () {
    return this.type === 'signup'
  }

  get isReset () {
    return this.type === 'reset'
  }

  get email () {
    return this.form.get('email')
  }

  get password () {
    return this.form.get('password')
  }

  get passwordConfirm () {
    return this.form.get('passwordConfirm')
  }

  get passwordDoesMatch () {
    if (this.type !== 'signup') {
      return true
    } else {
      return this.password?.value === this.passwordConfirm?.value
    }
  }

  get pwdHasNumber () {
    return /\d+/.test(this.password?.value)
  }

  get pwdHasLowercase () {
    return /[a-z]+/.test(this.password?.value)
  }

  get pwdHasUppercase () {
    return /[A-Z]+/.test(this.password?.value)
  }

  get pwdHasSpecial () {
    return /(\W)|(_)+/.test(this.password?.value)
  }

  get pwdLength () {
    return /[\s\S]{8,32}/.test(this.password?.value)
  }

  get pwdNotStartWhite () {
    return /^[^ ]+/.test(this.password?.value)
  }

  async onSubmit () {
    this.loading = true

    const email = this.email?.value
    const password = this.password?.value

    try {
      if (this.isLogin) {
        await signInWithEmailAndPassword(this.afAuth, email, password)
      }
      if (this.isSignup) {
        await createUserWithEmailAndPassword(this.afAuth, email, password)
      }
      if (this.isReset) {
        await sendPasswordResetEmail(this.afAuth, email)
        this.serverMessage = 'Check your email'
      }
    } catch (err) {
      const error: Error = <Error>err
      this.serverMessage = error.message
    }
    this.loading = false
  }
}
