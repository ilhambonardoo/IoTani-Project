import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./Clientlayout";

export const metadata: Metadata = {
  title: "IoTani",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased"}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
