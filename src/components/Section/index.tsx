"use client";
import { useRouter } from "next/navigation";
import { Container, Button } from "./styles";
import { useState } from "react";
import PageLoading from "../PageLoading/page";

interface Props {
  title: string;
}

export function Section({ title }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleNavigate = () => {
    setLoading(true);
    router.push("/catalog");
  };

  return (
    <Container>
      <h2>{title}</h2>
      <Button onClick={handleNavigate} disabled={loading}>
        Ver todos os bonés
      </Button>

      <PageLoading visible={loading} />
    </Container>
  );
}
