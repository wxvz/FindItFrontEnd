import { Routes } from '@angular/router';
import { ItemList } from './features/pages/item-list/item-list';
import { ItemForm } from './features/pages/item-form/item-form';
import { ItemDetails } from './features/pages/item-details/item-details';

export const routes: Routes = [
  { path: '', redirectTo: 'items', pathMatch: 'full' },
  { path: 'items', component: ItemList, title: 'Items | FindIt' },
  { path: 'items/new', component: ItemForm, title: 'Report an item | FindIt' },
  { path: 'items/:id/edit', component: ItemForm, title: 'Edit item | FindIt' },
  { path: 'items/:id', component: ItemDetails, title: 'Item details | FindIt' },
  { path: '**', redirectTo: 'items' },
];
