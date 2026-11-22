import { Component, OnInit, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CreateItemDto,
  ITEM_CATEGORIES,
  ITEM_STATUSES,
  ITEM_TYPES,
  Item,
  ItemStatus,
  ItemType,
} from '../../models/item.model';
import { ItemService } from '../../services/item.service';
import { notBlank } from '../../../shared/validators/not-blank.validator';

function notInFuture(control: AbstractControl<Date | null>): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return value > endOfToday ? { future: true } : null;
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TitleCasePipe,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
  ],
  selector: 'app-item-form',
  styleUrl: './item-form.scss',
  templateUrl: './item-form.html',
})
export class ItemForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private itemService = inject(ItemService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly id = input<string>();

  readonly types = ITEM_TYPES;
  readonly categories = ITEM_CATEGORIES;
  // Only show the matched status if the item is matched
  get statuses() {
    return ITEM_STATUSES.filter((s) => s !== 'matched' || this.itemForm.controls.status.value === 'matched');
  }  
  readonly today = new Date();

  loading = signal(false);
  saving = signal(false);
  saveError = signal<string | null>(null);

  itemForm = this.formBuilder.nonNullable.group({
    type: this.formBuilder.nonNullable.control<ItemType>('lost', Validators.required),
    itemName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50), notBlank],
    ],
    category: ['Other'],
    colour: ['', [Validators.required, Validators.maxLength(20), notBlank]],
    brand: ['', Validators.maxLength(30)],
    location: ['', Validators.maxLength(50)],
    dateFound: this.formBuilder.control<Date | null>(null, [Validators.required, notInFuture]),
    notes: ['', Validators.maxLength(300)],
    status: this.formBuilder.nonNullable.control<ItemStatus>('open', Validators.required),
  });

  get isEdit(): boolean {
    return !!this.id();
  }

  ngOnInit(): void {
    const id = this.id();
    if (!id) return;

    this.loading.set(true);
    this.itemForm.disable();
    this.itemService.getItemById(id).subscribe({
      next: (item: Item) => {
        this.itemForm.patchValue({
          type: item.type,
          itemName: item.itemName,
          category: ITEM_CATEGORIES.includes(item.category) ? item.category : 'Other',
          colour: item.colour,
          brand: item.brand ?? '',
          location: item.location ?? '',
          dateFound: new Date(item.dateFound),
          notes: item.notes ?? '',
          status: item.status,
        });
        this.itemForm.enable();
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.saveError.set(err.message);
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const value = this.itemForm.getRawValue();
    const item: CreateItemDto = {
      type: value.type,
      itemName: value.itemName.trim(),
      category: value.category,
      colour: value.colour.trim(),
      brand: value.brand.trim() || undefined,
      location: value.location.trim() || undefined,
      dateFound: toDateString(value.dateFound!),
      notes: value.notes.trim() || undefined,
      status: value.status,
    };

    this.saving.set(true);
    this.saveError.set(null);
    this.itemForm.disable();

    const id = this.id();
    const request = id ? this.itemService.updateItem(id, item) : this.itemService.addItem(item);

    request.subscribe({
      next: (saved) => {
        this.snackBar.open(`${saved.itemName} ${id ? 'updated' : 'saved'}`, 'Close', {
          duration: 5000,
        });
        this.router.navigate(['/items', saved._id]);
      },
      error: (err: Error) => {
        this.saveError.set(err.message);
        this.itemForm.enable();
        this.saving.set(false);
      },
    });
  }
}
