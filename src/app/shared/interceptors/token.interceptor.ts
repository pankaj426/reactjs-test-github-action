import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionStorageService } from '../services/session-storage.service';//'../services/session-storage.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	constructor(private sessionStorage: SessionStorageService, private localStorageService: LocalStorageService) { }

	private setBasicHeaders(headers: HttpHeaders) {
		const token = this.localStorageService.authToken; // Figure out, from where to take token
		headers.set('authorization', token);
		headers.append('Accept', 'application/json');
		headers.append('content-type', 'Application/Json');
	}
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// if (this.localStorageService.authToken && (!request.url.includes("upload_images") || !request.url.includes("upload_images/remove_defaulter_doc"))) {
		if (this.localStorageService.authToken && !request.url.includes("upload_images")) {
			request = request.clone({
				setHeaders: {
					authorization: this.localStorageService.authToken
				}
			});
		}
		return next.handle(request);
	}

	// private getAuthToken = () => {
	//     let isAlive: boolean = true;
	//     return this.sessionStorage.userAuthDetails.takeWhile(() => isAlive).subscribe((data) => {
	//         return data.result.authToken;
	//     });
	// };
}
