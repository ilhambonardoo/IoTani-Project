import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./Clientlayout";

export const metadata: Metadata = {
  title: "IoTani",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased"}>
        {modal}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
