"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function PaymentCompletePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const expectedAmount = searchParams.get("expectedAmount");

    if (!orderId || !expectedAmount) {
      setStatus("error");
      setMessage("잘못된 접근입니다.");
      return;
    }

    fetchApi("/api/reservations/complete", {
      method: "POST",
      body: JSON.stringify({ orderId, expectedAmount: Number(expectedAmount) }),
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
          setMessage("예약이 완료되었습니다.");
        } else {
          const data = await res.json();
          setStatus("error");
          setMessage(data.message || "결제 검증에 실패했습니다.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("오류가 발생했습니다.");
      });
  }, [searchParams]);

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ textAlign: "center" }}>
        {status === "loading" && (
          <>
            <div className="spinner" style={{ margin: "0 auto 16px" }} />
            <p>결제를 확인하고 있습니다...</p>
          </>
        )}
        {status === "success" && (
          <>
            <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)", marginBottom: 16 }}>{message}</p>
            <button onClick={goHome} style={{ padding: "12px 32px", background: "var(--primary)", color: "#fff", borderRadius: 10, fontSize: "1rem", fontWeight: 600 }}>
              홈으로 돌아가기
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#e53935", marginBottom: 16 }}>{message}</p>
            <button onClick={goHome} style={{ padding: "12px 32px", background: "#333", color: "#fff", borderRadius: 10, fontSize: "1rem", fontWeight: 600 }}>
              홈으로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
