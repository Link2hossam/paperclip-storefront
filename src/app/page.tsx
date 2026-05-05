import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paperclip",
  description: "Paperclip storefront",
};

export default function Home() {
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
      <h1>Paperclip</h1>
      <p>Hello from the storefront.</p>
    </main>
  );
}
