import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly baseUrl = environment.apiUrl;
  private api = `${this.baseUrl}user/`;

  private authenticatedUserSubject = new BehaviorSubject<any | null>(null);
  authenticatedUser$ = this.authenticatedUserSubject.asObservable();

  readonly AUTH_KEY = "MEETING_ROOM_AUTH";


  setAuthenticatedUser(auth : any){
    this.authenticatedUserSubject.next(auth);
  }

  getAuthenticatedUser() : AuthResponse{
    return this.authenticatedUserSubject.value;
  }

  constructor(private http: HttpClient, private router: Router) {}
 
  login(email: string, password: string): Observable<any> {
    return this.http.post<AuthResponse>(this.api, { email: email, password: password }).pipe(
      tap(res => {
        this.authenticatedUserSubject.next(res);
        this.saveAuthToLS(res);
        this.router.navigate(['/dashboard']);
      })
    )
  }
  signup(user: FormData) {
    let success;
    
    this.http.post(this.api+"signup", user).subscribe(response => {
      let data: any;
      data = response
      if (!response) {
        success = false;
        return null;
      }
      success = true
      this.router.navigate(["/authentication/signin"])
      return response
    })
    return success;
  }
  logout() {
    this.authenticatedUserSubject.next(null);
    this.clearAuthData()
    this.router.navigate(['/authentication/signin'])
  }

  setAuthTimer(expiresIn: number) {
    setTimeout(() => {
      this.logout();

    }, expiresIn * 1000);
  }

  saveAuthToLS(auth : AuthResponse){
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(auth));
  }

  removeAuthUserFromLS(){
    localStorage.removeItem(this.AUTH_KEY);
  }

  autoLogin(){
    const auth = localStorage.getItem(this.AUTH_KEY);
    if(auth){
      this.authenticatedUserSubject.next(JSON.parse(auth));
      this.router.navigate(['/dashboard']);
      return;
    }
    this.authenticatedUserSubject.next(null);
    this.router.navigate(['/authentication/signin'])
  }

   clearAuthData() {
    localStorage.removeItem(this.AUTH_KEY);
  }  
 
  sendCode(email: string) {
    let success;
   
      this.http.post(this.api+"forgotPassword", { email }).subscribe(response => {
      const idFP=response as string
      if (!response) {
        success = false;
        this.router.navigate(["/authentication/forgot"])
        return null;
      }
      success = true
      this.router.navigate(["/authentication/code"])
      localStorage.setItem("email", email);
      localStorage.setItem("idFP", idFP);
      return response
    }) 
  
    return success;
  }


  validateCode(code: string) {
    let success;
    var data = {
      code: code,
      email: this.getAuthenticatedUser().email!
    }
    this.http.post(this.api+"validateCode", data).subscribe(response => {
      if (!response) {
        success = false;
        return null;
      }
      success = true

      this.router.navigate(["/authentication/reset"])
      return response
    })
    return success;
  }

  changePassword(pass: string) {
    let success;
    pass
    let id= this.getAuthenticatedUser().id;
    let mail= this.getAuthenticatedUser().email;
      this.http.patch(this.api+"change-psw/"+id, {password:pass,email:mail}).subscribe(response => {
      if (!response) {
        success = false;
        return null;
      }
      success = true
      this.router.navigate(["/authentication/signin"]);
      localStorage.removeItem("email");
      localStorage.removeItem("idFP");      
      return response
    })
    return success;
  }
}
