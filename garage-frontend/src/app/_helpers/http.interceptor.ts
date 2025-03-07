import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthStorageService } from "../_services/storage/auth-storage.service";
import { catchError, Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor(
        private auth: AuthStorageService,
        private router : Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.auth.getToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        request = request.clone({
            withCredentials: true
        })

        return next.handle(request).pipe(catchError(err => {
            if (err.status == 401) {
                this.router.navigate(['login'])
            }

            throw err;
        }));
    }
}

export const provideHttpRequestInterceptor = {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptor,
    multi: true
};