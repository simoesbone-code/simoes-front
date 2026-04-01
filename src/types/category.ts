export interface CategoryProps {
  _id: string;
  category: string;

  image: {
    url: string;
    filename: string;
    public_id: string;
  };

  active: boolean;
  order: number;

  createdAt: string;
  updatedAt: string;
}
