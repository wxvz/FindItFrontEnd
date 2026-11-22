import { Component, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { LoadState, withLoadState } from '../../../shared/load-state';
import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item.service';

@Component({
  imports: [RouterLink, DatePipe, TitleCasePipe, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  selector: 'app-item-details',
  styleUrl: './item-details.scss',
  templateUrl: './item-details.html',
})
export class ItemDetails {
  private itemService = inject(ItemService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly id = input.required<string>();

  readonly initial: LoadState<Item> = { status: 'loading' };

  state = toSignal(
    toObservable(this.id).pipe(switchMap((id) => withLoadState(this.itemService.getItemById(id)))),
    { initialValue: this.initial },
  );

  confirmingDelete = signal(false);
  deleting = signal(false);
  deleteError = signal<string | null>(null);

  deleteItem(item: Item): void {
    this.deleting.set(true);
    this.deleteError.set(null);

    this.itemService.deleteItem(item._id).subscribe({
      next: () => {
        this.snackBar.open(`${item.itemName} deleted`, 'Close', { duration: 5000 });
        this.router.navigate(['/items']);
      },
      error: (err: Error) => {
        this.deleteError.set(err.message);
        this.deleting.set(false);
        this.confirmingDelete.set(false);
      },
    });
  }
}
