export interface StoreResponse {
  count: number;
  stores: StoreState[];
}

export type StoreState = {
  code: string;
  name: string;
  addr: string;
  type: string;
  lat: number;
  lng: number;
  stock_at: string;
  remain_stat: string;
  created_at: string;
};
