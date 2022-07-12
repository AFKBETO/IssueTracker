import { Component, OnInit } from '@angular/core'
import { Auth, authState, User, signOut } from '@angular/fire/auth'
import { EMPTY, Observable, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { traceUntilFirst } from '@angular/fire/performance'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  public readonly user: Observable<User | null> = EMPTY

  constructor(public afAuth: Auth) {
    if (afAuth) {
      this.user = authState(this.afAuth)
    }
  }

  signOut(): Promise<void> {
    return signOut(this.afAuth)
  }

  ngOnInit(): void {
  }

}
