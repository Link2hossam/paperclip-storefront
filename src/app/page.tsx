export default function HomePage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Paperclip</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        AI-native project management for teams that ship.
      </p>
      <a
        href="/products"
        style={{
          padding: "0.625rem 1.5rem",
          backgroundColor: "#0f172a",
          color: "#fff",
          borderRadius: 6,
          textDecoration: "none",
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      >
        Browse Products
      </a>
    </main>
  );
}
