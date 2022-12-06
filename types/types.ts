export interface ApiResponse<T> {
  data: Data<T>;
  message: string;
}

export interface Data<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: any;
  nextPage: number;
}

export interface Product {
  _id: string;
  productCode: string;
  title: string;
  media: Medum[];
  profitMargin: number;
  description: string;
  vendorPrice: number;
  price: number;
  totalSale: number;
  category: string;
  category_name: string;
  brand: string;
  brand_name: string;
  tags: string;
  options: any[];
  vendor: string;
  vendor_name: string;
  isbn: string;
  available: boolean;
  isActive: boolean;
  isFeatured: boolean;
  stockCountPending: number;
  stockCountConsumed: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  categories: Category[];
  vendors: Vendor[];
  brands: Brand[];
  subject?: string;
  subject_name?: string;
}

export interface Medum {
  imageURL: string;
  imageId: string;
  isFront: boolean;
  _id: string;
}

export interface Category {
  _id: string;
  title: string;
  isActive: boolean;
  isFeatured: boolean;
  rank: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  imageId: string;
  imageURL: string;
}

export interface Vendor {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  user_code: string;
  referred_by: string;
  commission: number;
  orderCount: number;
  totalSale: number;
  totalVendorProductSold: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  refreshToken: string;
}

export interface Brand {
  _id: string;
  title: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface Order {
  __v: number;
  _id: string;
  address: string;
  applied_Referral_Code: string;
  cart: Cart;
  city: string;
  createdAt: Date;
  email: string;
  name: string;
  order_number: number;
  orderStatus: OrderStatus;
  phone: string;
  postalCode: string;
  updatedAt: Date;
  users: any[];
}

export type OrderStatus =
  | "Order Accepted"
  | "Pending"
  | "Order Processing"
  | "Delivered"
  | "Out of Delivery"
  | "Cancelled";

export interface Cart {
  totalQty: number;
  totalCost: number;
  discount: number;
  shippingCharges: number;
  netCost: number;
  totalProfitMargin: number;
  items: Item[];
}

export interface Item {
  productId: string;
  vendor: string;
  qty: number;
  price: number;
  profitMargin: number;
  title: string;
  productCode: string;
  _id: string;
  options: Option[];
}

export interface Option {
  key: string;
  selected: string;
  _id: string;
}
