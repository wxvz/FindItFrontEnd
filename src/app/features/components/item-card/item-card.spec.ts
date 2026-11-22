import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ItemCard } from './item-card';

describe('ItemCard', () => {
  let component: ItemCard;
  let fixture: ComponentFixture<ItemCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCard);
    fixture.componentRef.setInput('item', {
      _id: '1',
      type: 'found',
      category: 'Electronics',
      itemName: 'MacBook Pro',
      colour: 'Silver',
      dateFound: '2026-11-01',
      status: 'open',
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
