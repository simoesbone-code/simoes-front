"use client";

import axios from "@/lib/axios";
import Cropper from "react-easy-crop";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { getCroppedImg } from "@/services/cropImage";
import { getCategory } from "@/hooks/useClient";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import {
  FiImage,
  FiTrash2,
  FiCheck,
  FiArrowLeft,
  FiBox,
  FiGrid,
<<<<<<< HEAD
=======
  FiCamera,
  FiUpload,
>>>>>>> 7bfe970 (atualizacao de upload de imagem)
} from "react-icons/fi";
import { CategoryProps } from "@/types/category";

type FormMode = "product" | "category";

export default function ProductForm() {
  const [mode, setMode] = useState<FormMode>("product");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [categoryImagePreview, setCategoryImagePreview] = useState<
    string | null
  >(null);
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);

  const [categoryOption, setCategoryOption] = useState<any>(null);

  const [isLoadingCategoryData, setIsLoadingCategoryData] = useState(false);

  const { data: dataCategory, refetch: refetchCategories } = useQuery<
    CategoryProps[]
  >({
    queryKey: ["Category"],
    queryFn: getCategory,
  });

  const searchParams = useSearchParams();
  const { id } = useParams();
  const router = useRouter();

  const productId = searchParams.get("id");
  const categoryId = searchParams.get("categoryId");
  const pageMode = searchParams.get("mode");

  const isEditingProduct = Boolean(productId);
  const isUpdatingCategory = pageMode === "update" && Boolean(categoryId);

  const [isCropping, setIsCropping] = useState(false);
  const [cropTarget, setCropTarget] = useState<"product" | "category">(
    "product",
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    priceUnit: 0,
    priceWholesale: 0,
  });

  const [categoryForm, setCategoryForm] = useState({
    category: "",
  });

  const categoryOptions =
    dataCategory?.map((item) => ({
      label: item.category,
      value: item.category,
    })) ?? [];

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const parseBRLToNumber = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    return Number(numeric) / 100;
  };

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>,
    target: "product" | "category",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (target === "product") {
      setImagePreview(preview);
    } else {
      setCategoryImagePreview(preview);
    }

    setCropTarget(target);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setIsCropping(true);
<<<<<<< HEAD
=======

    e.target.value = "";
>>>>>>> 7bfe970 (atualizacao de upload de imagem)
  }

  function handleRemoveImage(target: "product" | "category") {
    if (target === "product") {
      setImagePreview(null);
      setImageFile(null);
      return;
    }

    setCategoryImagePreview(null);
    setCategoryImageFile(null);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "priceUnit" || name === "priceWholesale") {
      setForm((prev) => ({
        ...prev,
        [name]: parseBRLToNumber(value),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmitProduct(e: FormEvent) {
    e.preventDefault();

    if (!isEditingProduct && !imageFile) {
      alert("Selecione uma imagem");
      return;
    }

    if (!form.category) {
      alert("Selecione uma categoria");
      return;
    }

    try {
      setIsSubmitting(true);
      setProgress(0);

      const formData = new FormData();

      if (imageFile) formData.append("image", imageFile);

      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("priceUnit", String(form.priceUnit));
      formData.append("priceWholesale", String(form.priceWholesale));

      const url = isEditingProduct
        ? `/product/update-product/${productId}`
        : "/product/create-product";

      const method = isEditingProduct ? "put" : "post";

      await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) {
            const percentCompleted = Math.round(
              (event.loaded * 100) / event.total,
            );
            setProgress(percentCompleted);
          }
        },
      });

      router.push(`/dashboard/admin/${id}`);
    } catch (error) {
      alert("Erro ao salvar produto");
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  }

  async function handleSubmitCategory(e: FormEvent) {
    e.preventDefault();

    if (!isUpdatingCategory && !categoryForm.category.trim()) {
      alert("Digite o nome da categoria");
      return;
    }

    if (!isUpdatingCategory && !categoryImageFile) {
      alert("Selecione uma imagem para a categoria");
      return;
    }

    if (isUpdatingCategory && !categoryImageFile) {
      alert("Selecione uma nova imagem para atualizar a categoria");
      return;
    }

    try {
      setIsSubmittingCategory(true);
      setProgress(0);

      const formData = new FormData();

<<<<<<< HEAD
      // Só envia o nome no cadastro.
      // Na atualização, o nome da categoria NÃO é enviado.
=======
>>>>>>> 7bfe970 (atualizacao de upload de imagem)
      if (!isUpdatingCategory) {
        formData.append("category", categoryForm.category.trim());
      }

<<<<<<< HEAD
      // Na atualização, apenas a imagem é enviada
=======
>>>>>>> 7bfe970 (atualizacao de upload de imagem)
      if (categoryImageFile) {
        formData.append("image", categoryImageFile);
      }

      if (isUpdatingCategory) {
        await axios.put(`/category/update-category/${categoryId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            if (event.total) {
              const percentCompleted = Math.round(
                (event.loaded * 100) / event.total,
              );
              setProgress(percentCompleted);
            }
          },
        });

        alert("Imagem da categoria atualizada com sucesso");
      } else {
        await axios.post("/category/create-category", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            if (event.total) {
              const percentCompleted = Math.round(
                (event.loaded * 100) / event.total,
              );
              setProgress(percentCompleted);
            }
          },
        });

        alert("Categoria cadastrada com sucesso");
      }

      setCategoryForm({ category: "" });
      setCategoryImagePreview(null);
      setCategoryImageFile(null);
      setProgress(0);

      await refetchCategories();

      router.push(`/dashboard/admin/${id}`);
    } catch (error) {
      alert(
        isUpdatingCategory
          ? "Erro ao atualizar categoria"
          : "Erro ao salvar categoria",
      );
    } finally {
      setIsSubmittingCategory(false);
      setProgress(0);
    }
  }

  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      const { data } = await axios.get(`/product/get-product/${productId}`);

      setForm({
        name: data.name,
        category: data.category,
        priceUnit: data.priceUnit,
        priceWholesale: data.priceWholesale,
      });

      setCategoryOption({
        label: data.category,
        value: data.category,
      });

      setImagePreview(data.image.url);
    }

    loadProduct();
  }, [productId]);

  useEffect(() => {
    if (!isUpdatingCategory || !categoryId || !dataCategory?.length) return;

    async function loadCategoryData() {
      try {
        setIsLoadingCategoryData(true);

        const categoryDataToUpdate = dataCategory?.find(
          (item) => item._id === categoryId,
        );

        if (!categoryDataToUpdate) return;

        setMode("category");

        setCategoryForm({
          category: categoryDataToUpdate.category || "",
        });

        setCategoryImagePreview(categoryDataToUpdate.image?.url || null);
        setCategoryImageFile(null);
      } finally {
        setIsLoadingCategoryData(false);
      }
    }

    loadCategoryData();
  }, [isUpdatingCategory, categoryId, dataCategory]);

  const cropImageSource =
    cropTarget === "product" ? imagePreview : categoryImagePreview;

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-6">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center gap-4">
          <button
<<<<<<< HEAD
=======
            type="button"
>>>>>>> 7bfe970 (atualizacao de upload de imagem)
            onClick={() => router.push(`/dashboard/admin/${id}`)}
            className="flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
          >
            <FiArrowLeft size={18} />
            Voltar
          </button>

          <h1 className="text-xl font-bold text-neutral-900">
            {mode === "product"
              ? isEditingProduct
                ? "Atualizar produto"
                : "Cadastrar produto"
              : isUpdatingCategory
                ? "Atualizar categoria"
                : "Cadastrar categoria"}
          </h1>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              if (isUpdatingCategory) return;
              setMode("product");
            }}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold transition ${
              mode === "product"
                ? "bg-orange-500 text-white shadow-sm"
                : "border border-orange-200 bg-white text-orange-600 hover:bg-orange-50"
            } ${isUpdatingCategory ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <FiBox size={18} />
            Produto
          </button>

          <button
            type="button"
            onClick={() => setMode("category")}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold transition ${
              mode === "category"
                ? "bg-orange-500 text-white shadow-sm"
                : "border border-orange-200 bg-white text-orange-600 hover:bg-orange-50"
            }`}
          >
            <FiGrid size={18} />
            Categoria
          </button>
        </div>

        {mode === "product" && (
          <form
            onSubmit={handleSubmitProduct}
            className="space-y-5 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
          >
            {!imagePreview ? (
<<<<<<< HEAD
              <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 text-center">
                <FiImage size={30} className="mb-2 text-orange-500" />

                <span className="font-semibold text-neutral-800">
                  Adicionar imagem
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "product")}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={imagePreview}
                  className="aspect-square w-full object-cover"
                  alt="Preview do produto"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveImage("product")}
                  className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white"
                >
                  <FiTrash2 size={14} />
                  Remover
                </button>
=======
              <div className="space-y-3">
                <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 px-4 text-center">
                  <FiImage size={30} className="mb-2 text-orange-500" />

                  <span className="font-semibold text-neutral-800">
                    Adicionar imagem do produto
                  </span>

                  <span className="mt-1 text-xs text-neutral-500">
                    Você pode escolher da galeria ou usar a câmera do celular
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "product")}
                    className="hidden"
                  />
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 font-semibold text-orange-600 transition hover:bg-orange-50">
                    <FiCamera size={18} />
                    Tirar foto
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleImageChange(e, "product")}
                      className="hidden"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 font-semibold text-orange-600 transition hover:bg-orange-50">
                    <FiUpload size={18} />
                    Escolher da galeria
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "product")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={imagePreview}
                    className="aspect-square w-full object-cover"
                    alt="Preview do produto"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveImage("product")}
                    className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white"
                  >
                    <FiTrash2 size={14} />
                    Remover
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 font-semibold text-orange-600 transition hover:bg-orange-50">
                    <FiCamera size={18} />
                    Tirar outra foto
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleImageChange(e, "product")}
                      className="hidden"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 font-semibold text-orange-600 transition hover:bg-orange-50">
                    <FiUpload size={18} />
                    Trocar pela galeria
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "product")}
                      className="hidden"
                    />
                  </label>
                </div>
>>>>>>> 7bfe970 (atualizacao de upload de imagem)
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-neutral-700">
                Nome do produto
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-700">
                Categoria
              </label>

              <Select
                isClearable
                placeholder="Selecione uma categoria"
                options={categoryOptions}
                value={categoryOption}
                onChange={(option) => {
                  setCategoryOption(option);
                  setForm((prev) => ({
                    ...prev,
                    category: option ? option.value : "",
                  }));
                }}
                noOptionsMessage={() => "Nenhuma categoria encontrada"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700">
                  Valor unitário
                </label>

                <input
                  type="text"
                  name="priceUnit"
                  value={formatBRL(form.priceUnit)}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700">
                  Valor atacado
                </label>

                <input
                  type="text"
                  name="priceWholesale"
                  value={formatBRL(form.priceWholesale)}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-60"
            >
              <FiCheck />
              {isEditingProduct ? "Atualizar produto" : "Cadastrar produto"}
            </button>

            {isSubmitting && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-orange-100">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-orange-500 transition-all"
                />
              </div>
            )}
          </form>
        )}

        {mode === "category" && (
          <form
            onSubmit={handleSubmitCategory}
            className="space-y-5 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
          >
            {isUpdatingCategory && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
                Você está atualizando uma categoria existente. Apenas a imagem
                pode ser alterada.
              </div>
            )}

            {isLoadingCategoryData ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-orange-200 bg-orange-50 text-sm font-semibold text-orange-600">
                Carregando dados da categoria...
              </div>
            ) : (
              <>
                {!categoryImagePreview ? (
<<<<<<< HEAD
                  <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 text-center">
                    <FiImage size={30} className="mb-2 text-orange-500" />

                    <span className="font-semibold text-neutral-800">
                      {isUpdatingCategory
                        ? "Adicionar nova imagem da categoria"
                        : "Adicionar imagem da categoria"}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "category")}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={categoryImagePreview}
                      className="aspect-square w-full object-cover"
                      alt="Preview da categoria"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage("category")}
                      className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white"
                    >
                      <FiTrash2 size={14} />
                      Remover
                    </button>
=======
                  <div className="space-y-3">
                    <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 px-4 text-center">
                      <FiImage size={30} className="mb-2 text-orange-500" />

                      <span className="font-semibold text-neutral-800">
                        {isUpdatingCategory
                          ? "Adicionar nova imagem da categoria"
                          : "Adicionar imagem da categoria"}
                      </span>

                      <span className="mt-1 text-xs text-neutral-500">
                        Você pode escolher da galeria ou usar a câmera do celular
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "category")}
                        className="hidden"
                      />
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 font-semibold text-orange-600 transition hover:bg-orange-50">
                        <FiCamera size={18} />
                        Tirar foto
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleImageChange(e, "category")}
                          className="hidden"
                        />
                      </label>

                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 font-semibold text-orange-600 transition hover:bg-orange-50">
                        <FiUpload size={18} />
                        Escolher da galeria
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "category")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={categoryImagePreview}
                        className="aspect-square w-full object-cover"
                        alt="Preview da categoria"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage("category")}
                        className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white"
                      >
                        <FiTrash2 size={14} />
                        Remover
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 font-semibold text-orange-600 transition hover:bg-orange-50">
                        <FiCamera size={18} />
                        Tirar outra foto
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleImageChange(e, "category")}
                          className="hidden"
                        />
                      </label>

                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 font-semibold text-orange-600 transition hover:bg-orange-50">
                        <FiUpload size={18} />
                        Trocar pela galeria
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "category")}
                          className="hidden"
                        />
                      </label>
                    </div>
>>>>>>> 7bfe970 (atualizacao de upload de imagem)
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-neutral-700">
                    Nome da categoria
                  </label>

                  <input
                    type="text"
                    value={categoryForm.category}
                    onChange={(e) => {
                      if (isUpdatingCategory) return;

                      setCategoryForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }));
                    }}
                    disabled={isUpdatingCategory}
                    readOnly={isUpdatingCategory}
                    placeholder={
                      isUpdatingCategory
                        ? "O nome da categoria não pode ser alterado"
                        : "Digite o nome da nova categoria"
                    }
                    className={`mt-1 w-full rounded-xl border px-4 py-3 ${
                      isUpdatingCategory
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500"
                        : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingCategory}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  <FiCheck />
                  {isUpdatingCategory
                    ? "Atualizar imagem da categoria"
                    : "Cadastrar categoria"}
                </button>

                {isSubmittingCategory && (
                  <div className="h-2 w-full overflow-hidden rounded-full bg-orange-100">
                    <div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-orange-500 transition-all"
                    />
                  </div>
                )}
              </>
            )}
          </form>
        )}
      </div>

      {isCropping && cropImageSource && (
<<<<<<< HEAD
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
=======
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
>>>>>>> 7bfe970 (atualizacao de upload de imagem)
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white">
            <div className="relative h-80">
              <Cropper
                image={cropImageSource}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>

            <div className="flex gap-2 p-4">
              <button
                type="button"
                className="flex-1 rounded-lg bg-orange-500 py-2 text-white"
                onClick={async () => {
                  const croppedFile = await getCroppedImg(
                    cropImageSource,
                    croppedAreaPixels,
                  );

                  if (cropTarget === "product") {
                    setImageFile(croppedFile);
                    setImagePreview(URL.createObjectURL(croppedFile));
                  } else {
                    setCategoryImageFile(croppedFile);
                    setCategoryImagePreview(URL.createObjectURL(croppedFile));
                  }

                  setIsCropping(false);
                }}
              >
                Confirmar
              </button>

              <button
                type="button"
                className="flex-1 rounded-lg border py-2"
                onClick={() => {
                  setIsCropping(false);

                  if (cropTarget === "product") {
                    setImagePreview(null);
                  } else {
                    setCategoryImagePreview(null);
                  }
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}