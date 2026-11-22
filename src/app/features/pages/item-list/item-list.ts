import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { withLoadState } from '../../../shared/load-state';
import { ItemCard } from '../../components/item-card/item-card';
import { ItemType } from '../../models/item.model';
import { ItemService } from '../../services/item.service';

type TypeFilter = 'all' | ItemType;

@Component({
  imports: [ItemCard, RouterLink, MatButtonModule, MatButtonToggleModule, MatProgressSpinnerModule],
  selector: 'app-item-list',
  styleUrl: './item-list.scss',
  templateUrl: './item-list.html',
})
export class ItemList {
  private itemService = inject(ItemService);

  state = toSignal(withLoadState(this.itemService.getItems()), { requireSync: true });

  filter = signal<TypeFilter>('all');

  visibleItems = computed(() => {
    const s = this.state();
    if (s.status !== 'loaded') return [];
    const f = this.filter();
    return f === 'all' ? s.data : s.data.filter((item) => item.type === f);
  });
}
