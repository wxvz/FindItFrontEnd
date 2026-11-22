import { Component, input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Item } from '../../models/item.model';

@Component({
  imports: [RouterLink, DatePipe, TitleCasePipe, MatCardModule, MatButtonModule],
  selector: 'app-item-card',
  styleUrl: './item-card.scss',
  templateUrl: './item-card.html',
})
export class ItemCard {
  item = input.required<Item>();
}
