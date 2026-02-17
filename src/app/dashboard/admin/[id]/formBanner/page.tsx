"use client";

import axios from "@/lib/axios";
import Cropper from "react-easy-crop";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { getCroppedImg } from "@/services/cropImage";

import {
  Container,
  Form,
  UploadCard,
  ImagePreview,
  RemoveImageButton,
  Button,
  ProgressBar,
  ProgressBarContainer,
  CropperActions,
  CropperContainer,
  CropperOverlay,
} from "./styles";

import { getBanner } from "@/hooks/useClient";
import { useQuery } from "@tanstack/react-query";
import { PropsBanner } from "@/types/banner";
import { queryClient } from "@/services/queryClient";

export default function BannerForm() {
  const { data: dataBanner } = useQuery<PropsBanner[]>({
    queryKey: ["Banner"],
    queryFn: getBanner,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!dataBanner || dataBanner.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 >= dataBanner.length ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [dataBanner]);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setIsCropping(true);
  }

  function handleRemoveImage() {
    setImagePreview(null);
    setImageFile(null);
  }

  async function handleDeleteBanner(id: string) {
    const confirmDelete = window.confirm(
      "Deseja realmente remover este banner?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`/banner/delete-banner/${id}`);

      alert("Banner removido com sucesso!");

      // Atualiza a lista de banners
      queryClient.invalidateQueries({ queryKey: ["Banner"] });
    } catch (error) {
      console.error("Erro ao deletar banner:", error);
      alert("Erro ao remover banner");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!imageFile) {
      alert("Selecione e corte uma imagem");
      return;
    }

    try {
      setIsSubmitting(true);
      setProgress(0);

      const formData = new FormData();
      formData.append("image", imageFile);

      await axios.post("/banner/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });

      alert("Banner salvo com sucesso!");
      handleRemoveImage();
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar banner");
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  }

  return (
    <Container>
      {/* ================= FORM ================= */}
      <Form onSubmit={handleSubmit}>
        {!imagePreview ? (
          <UploadCard>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <span>Adicionar banner</span>
            <small>Recomendado: 1920x600</small>
          </UploadCard>
        ) : (
          <ImagePreview>
            <img src={imagePreview} alt="Preview banner" />
            <RemoveImageButton type="button" onClick={handleRemoveImage}>
              Remover
            </RemoveImageButton>
          </ImagePreview>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? `Enviando... ${progress}%` : "Salvar banner"}
        </Button>

        {isSubmitting && (
          <ProgressBarContainer>
            <ProgressBar progress={progress} />
          </ProgressBarContainer>
        )}
      </Form>

      {/* ================= PREVIEW SLIDER ================= */}
      {dataBanner && dataBanner.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <h3 style={{ marginBottom: 16 }}>Banners cadastrados</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {dataBanner.map((banner) => (
              <div
                key={banner._id}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  overflow: "hidden",
                  background: "#f3f4f6",
                }}
              >
                {/* Imagem */}
                <img
                  src={banner.image.url}
                  alt="Banner"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))",
                  }}
                />

                {/* Botão deletar */}
                <button
                  type="button"
                  onClick={() => handleDeleteBanner(banner._id)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    padding: "6px 10px",
                    background: "#dc2626",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= CROPPER ================= */}
      {isCropping && imagePreview && (
        <CropperOverlay>
          <CropperContainer>
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            />

            <CropperActions>
              <button
                className="confirm"
                type="button"
                onClick={async () => {
                  const cropped = await getCroppedImg(
                    imagePreview,
                    croppedAreaPixels,
                  );
                  setImageFile(cropped);
                  setImagePreview(URL.createObjectURL(cropped));
                  setIsCropping(false);
                }}
              >
                Confirmar
              </button>

              <button
                className="cancel"
                type="button"
                onClick={() => {
                  setIsCropping(false);
                  setImagePreview(null);
                }}
              >
                Cancelar
              </button>
            </CropperActions>
          </CropperContainer>
        </CropperOverlay>
      )}
    </Container>
  );
}
