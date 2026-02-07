"use client";

import { BackButton } from "@/app/auth/styles";
import PageLoading from "@/components/PageLoading/page";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { getProduct } from "@/hooks/useClient";
import { PropsProduct } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

export default function ProductPage() {
  const { data: dataProduct, refetch } = useQuery<PropsProduct[]>({
    queryKey: ["Product"],
    queryFn: getProduct,
  });

  const router = useRouter();
  const { producId } = useParams();

  const [loading, setLoading] = useState(false);

  const product = dataProduct?.find((p) => p._id === producId);

  if (!product) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <h1
          style={{
            color: "#f97316", // laranja
            fontSize: "2rem",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Produto não encontrado
        </h1>
      </div>
    );
  }

  return (
    <div className="page">
      <BackButton
        onClick={() => {
          setLoading(true);
          router.push("/catalog");
        }}
      >
        <FiArrowLeft size={20} />
        Voltar
      </BackButton>
      {/* IMAGEM */}
      <div className="image-box">
        <img src={product.image.url} alt={product.name} />
      </div>

      {/* CONTEÚDO */}
      <div className="content">
        <h1>{product.name}</h1>

        <div className="prices">
          <div className="price">
            <span>Varejo:</span>
            <strong>R$ {Number(product.priceUnit).toFixed(2)}</strong>
          </div>

          <div className="price">
            <span>Atacado:</span>
            <strong>R$ {Number(product.priceWholesale).toFixed(2)}</strong>
          </div>
        </div>

        {/* DECORAÇÃO */}
        <div className="decoracao-bolinhas">
          <span className="bola grande" />
          <span className="bola media" />
          <span className="bola pequena" />
        </div>
      </div>

      <WhatsAppFloatingButton
        phone="5583998033753"
        message="Olá! Vim pelo site e gostaria de saber mais."
      />

      <style jsx>{`
        .page {
          min-height: 100vh;
        }

        .image-box {
          background: #ddd;
          display: flex;
          justify-content: center;
        }

        .image-box img {
          max-width: 100%;
          border-radius: 6px;
        }

        .content {
          padding: 40px;
        }

        h1 {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 30px;
        }

        .prices {
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: flex-end;
        }

        .price {
          display: flex;
          flex-direction: column;
        }

        .price span {
          font-size: 14px;
          font-weight: 600;
        }

        .price strong {
          background: #d97745;
          color: #fff;
          padding: 10px 24px;
          border-radius: 6px;
          font-size: 18px;
          text-align: center;
          min-width: 140px;
        }

        .page {
          min-height: 100vh;
          position: relative;
          background: #f5f5f5;
        }

        .decoracao-bolinhas {
          position: absolute;
          bottom: 30px;
          left: 24px;
          width: 140px;
          height: 140px;
          pointer-events: none;
        }

        .decoracao-bolinhas .bola {
          position: absolute;
          background: #d97745;
          border-radius: 50%;
        }

        .decoracao-bolinhas .grande {
          width: 65px;
          height: 65px;
          bottom: 0;
          left: 0;
        }

        .decoracao-bolinhas .media {
          width: 46px;
          height: 46px;
          bottom: 70px;
          left: 10px;
        }

        .decoracao-bolinhas .pequena {
          width: 38px;
          height: 38px;
          bottom: 20px;
          left: 75px;
        }

        @media (max-width: 480px) {
          .decoracao-bolinhas {
            bottom: 16px;
            left: 16px;
          }
        }

        @media (min-width: 1024px) {
          .page {
            max-width: 920px;
            margin: 0 auto;
          }

          .container {
            max-width: 900px;
            padding: 32px;
          }

          .image-box img {
            max-width: 60%;
          }
        }
      `}</style>

      <PageLoading visible={loading} />
    </div>
  );
}
