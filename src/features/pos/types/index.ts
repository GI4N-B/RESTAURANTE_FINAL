export type POSCategory = {
  id: string;
  name: string;
  color: string;
  sort_order: number;
};

export type POSProduct = {
  id: string;
  category_id: string;
  name: string;
  price: number;
  image_url?: string;
  is_combo: boolean;
  has_modifiers: boolean;
  stock?: number;
};

export type ModifierGroup = {
  id: string;
  name: string; // ej: "Término de la carne", "Salsas"
  min_selections: number;
  max_selections: number;
  options: ModifierOption[];
};

export type ModifierOption = {
  id: string;
  name: string;
  price_adjustment: number; // 0 si es gratis
};

export type CartModifier = {
  group_name: string;
  option_name: string;
  price_adjustment: number;
};

export type CartItem = {
  uuid: string; // Identificador único en el carrito
  product: POSProduct;
  quantity: number;
  modifiers: CartModifier[];
  notes: string;
  unit_total: number;
};

export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER' | 'MIXED';
export type OrderStatus = 'PENDING' | 'PAID' | 'KITCHEN' | 'CANCELLED';

export type POSTicket = {
  id: string;
  ticket_number: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  payment_method?: PaymentMethod;
};