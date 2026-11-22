export type ItemType = 'lost' | 'found';
export type ItemStatus = 'open' | 'matched' | 'returned';

export const ITEM_TYPES: ItemType[] = ['lost', 'found'];
export const ITEM_STATUSES: ItemStatus[] = ['open', 'matched', 'returned'];
export const ITEM_CATEGORIES: string[] = [
  'Electronics',
  'Bags',
  'Clothing',
  'Keys',
  'Wallets & cards',
  'Stationery',
  'Jewellery & Accessories',
  'ID cards',
  'Other',
];

export interface Item {
  _id: string;
  type: ItemType;
  category: string;
  itemName: string;
  colour: string;
  brand?: string | null;
  location?: string | null;
  dateFound: string;
  notes?: string | null;
  status: ItemStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateItemDto {
  type: ItemType;
  category: string;
  itemName: string;
  colour: string;
  brand?: string | null;
  location?: string | null;
  dateFound: string;
  notes?: string | null;
  status: ItemStatus;
}

export type UpdateItemDto = Partial<CreateItemDto>;
