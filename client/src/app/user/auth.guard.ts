import { Injectable } from '@angular/core'
import { Auth } from '@angular/fire/auth'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router'
import { SnackService } from '../services/snack.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor (
    private afAuth: Auth,
    private snack: SnackService
  ) { }

  async canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Promise<boolean> {
    const user = this.afAuth.currentUser
    const isLoggedIn = !!user

    if (!isLoggedIn) {
      this.snack.authError()
    }
    
    return isLoggedIn
  }
  
}
