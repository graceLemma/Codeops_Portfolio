export type Area =
  | "Bole"
  | "Kazanchis"
  | "Piassa"
  | "CMC";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Out for delivery"
  | "Delivered";

export type Dish = {
  name: string;
  price: number;
};

export type Order = {
  readonly id: number;
  name: string;
  area: Area;
  status: OrderStatus;
  dishes: Dish[];
  phone?: string;
  total: number;
};