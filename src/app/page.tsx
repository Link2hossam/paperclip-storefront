import ProductGrid from "./components/ProductGrid";

export default function HomePage() {
  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: 960,
        margin: "0 auto",
        padding: "2rem 1rem",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Paperclip</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        AI-native project management for teams that ship.
      </p>
      <ProductGrid />
    </main>
  );
}
