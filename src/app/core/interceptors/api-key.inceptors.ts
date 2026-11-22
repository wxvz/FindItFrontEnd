import { HttpInterceptorFn } from '@angular/common/http';
import { API_KEY, API_URL } from '../api.config';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { 'x-api-key': API_KEY } }));
};
