import axios from "@/lib/axios";
import { CategoryProps } from "@/types/category";

export type CatalogConfigResponse = {
  key: string;
  categoryOrder: string[];
};

export const getProduct = async () => {
  const response = await axios.get("/product/get-all-product");
  return response.data;
};

export const getBanner = async () => {
  try {
    const res = await axios.get(`banner/banners-get`);
    return res.data;
  } catch (error) {
    console.error("Error no servidor:", error);
  }
};

/* Lista de categorias */
export const getCategory = async (): Promise<CategoryProps[]> => {
  const response = await axios.get("/category/get-categories");
  return response.data;
};

/* salvar lista de produtos */

export const getCatalogConfig = async (): Promise<CatalogConfigResponse> => {
  const response = await axios.get("/product/catalog-config");
  return response.data;
};

export const saveCategoryOrder = async (categoryOrder: string[]) => {
  const response = await axios.put("/product/update-category-order", {
    categoryOrder,
  });

  return response.data;
};

export const saveProductOrder = async (
  category: string,
  productIds: string[],
) => {
  const response = await axios.put("/product/update-product-order", {
    category,
    productIds,
  });

  return response.data;
};
