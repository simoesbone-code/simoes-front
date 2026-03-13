"use client";

import axios from "@/lib/axios";
import Cropper from "react-easy-crop";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { getCroppedImg } from "@/services/cropImage";
import { getProduct } from "@/hooks/useClient";
import { PropsProduct } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import CreatableSelect from "react-select/creatable";
import { FiImage, FiTrash2, FiCheck, FiArrowLeft } from "react-icons/fi";

export default function ProductForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: dataProduct } = useQuery<PropsProduct[]>({
    queryKey: ["Product"],
    queryFn: getProduct,
  });

  const searchParams = useSearchParams();
  const { id } = useParams();
  const router = useRouter();

  const productId = searchParams.get("id");
  const isEditing = Boolean(productId);

  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categoryOption, setCategoryOption] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    priceUnit: 0,
    priceWholesale: 0,
  });

  const categoryOptions =
    dataProduct
      ?.map((p) => p.category)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((cat) => ({
        label: cat,
        value: cat,
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

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setIsCropping(true);
  }

  function handleRemoveImage() {
    setImagePreview(null);
    setImageFile(null);
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!isEditing && !imageFile) {
      alert("Selecione uma imagem");
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

      const url = isEditing
        ? `/product/update-product/${productId}`
        : "/product/create-product";

      const method = isEditing ? "put" : "post";

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

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-6">

      <div className="mx-auto max-w-xl">

        {/* HEADER */}

        <div className="mb-6 flex items-center gap-4">

          <button
            onClick={() => router.push(`/dashboard/admin/${id}`)}
            className="flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
          >
            <FiArrowLeft size={18} />
            Voltar
          </button>

          <h1 className="text-xl font-bold text-neutral-900">
            {isEditing ? "Atualizar produto" : "Cadastrar produto"}
          </h1>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
        >

          {!imagePreview ? (
            <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 text-center">

              <FiImage size={30} className="text-orange-500 mb-2" />

              <span className="font-semibold text-neutral-800">
                Adicionar imagem
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

            </label>
          ) : (
            <div className="relative overflow-hidden rounded-xl">

              <img
                src={imagePreview}
                className="aspect-square w-full object-cover"
              />

              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white"
              >
                <FiTrash2 size={14} />
                Remover
              </button>

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

            <CreatableSelect
              isClearable
              placeholder="Categoria"
              options={categoryOptions}
              value={categoryOption}
              onChange={(option) => {
                setCategoryOption(option);
                setForm((prev) => ({
                  ...prev,
                  category: option ? option.label : "",
                }));
              }}
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
            {isEditing ? "Atualizar produto" : "Cadastrar produto"}
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

      </div>

      {isCropping && imagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

          <div className="w-full max-w-md bg-white rounded-xl overflow-hidden">

            <div className="relative h-80">
              <Cropper
                image={imagePreview}
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
                className="flex-1 rounded-lg bg-orange-500 py-2 text-white"
                onClick={async () => {
                  const croppedFile = await getCroppedImg(
                    imagePreview,
                    croppedAreaPixels,
                  );

                  setImageFile(croppedFile);
                  setImagePreview(URL.createObjectURL(croppedFile));
                  setIsCropping(false);
                }}
              >
                Confirmar
              </button>

              <button
                className="flex-1 rounded-lg border py-2"
                onClick={() => {
                  setIsCropping(false);
                  setImagePreview(null);
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