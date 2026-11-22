import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../core/api.config';
import { CreateItemDto, Item, UpdateItemDto } from '../models/item.model';

@Service()
export class ItemService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/items`;

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  getItemById(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }

  addItem(item: CreateItemDto): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }

  updateItem(id: string, changes: UpdateItemDto): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${id}`, changes);
  }

  deleteItem(id: string): Observable<Item> {
    return this.http.delete<Item>(`${this.apiUrl}/${id}`);
  }
}
