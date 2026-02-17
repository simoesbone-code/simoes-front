"use client";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Container } from "./styles";

import { CgProfile } from "react-icons/cg";
import { IoHomeSharp } from "react-icons/io5";
import PageLoading from "../PageLoading/page";

export function Header() {
  const router = useRouter();

  const [credentialVerifier, setCredentialVerifier] = useState(false);
  const [loading, setLoading] = useState(false);

  const { "nextauth.token": tokenParse } = parseCookies();
  const { "nextauth.userId": tokenUserId } = parseCookies();

  const handleNavigate = () => {
    setLoading(true);

    if (credentialVerifier && tokenUserId) {
      router.push(`/dashboard/admin/${tokenUserId}`);
    } else {
      router.push("/auth");
    }
  };

  useEffect(() => {
    setCredentialVerifier(Boolean(tokenParse && tokenUserId));
  }, [tokenParse, tokenUserId]);

  return (
    <Container>
      <div className="flex items-center">
        <img
          src="https://res.cloudinary.com/dz46wt0iy/image/upload/fl_preserve_transparency/v1769912818/1769912016331_ox3dlk.jpg?_s=public-apps"
          alt="icon"
        />
      </div>

      {credentialVerifier ? (
        <button onClick={handleNavigate}>
          <IoHomeSharp />
        </button>
      ) : (
        <button onClick={handleNavigate}>
          <CgProfile />
        </button>
      )}

      <PageLoading visible={loading} />
    </Container>
  );
}
