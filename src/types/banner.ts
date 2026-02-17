export interface PropsBanner {
  _id: string;

  image: {
    url: string;
    filename: string;
    public_id: string;
  };

  active: boolean;
  order: number;

  createdAt: string;
  updatedAt: string;

  __v?: number;
}
[];
