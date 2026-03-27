export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", fontFamily: "-apple-system, sans-serif", color: "#333", lineHeight: 1.8, fontSize: "var(--fs-label)" }}>
      {children}
    </div>
  );
}
