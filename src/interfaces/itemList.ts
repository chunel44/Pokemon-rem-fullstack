export interface ItemListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: SmallItem[];
}

export interface SmallItem {
  name: string;
  url: string;
  id: number;
  img: string;
}