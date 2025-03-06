import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthStorageService } from "../_services/storage/auth-storage.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor(private auth: AuthStorageService) { }
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

        return next.handle(request);
    }
}

export const provideHttpRequestInterceptor = {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptor,
    multi: true
};