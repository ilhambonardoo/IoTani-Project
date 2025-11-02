import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./Clientlayout";
import Provider from "./Provider";

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
        <Provider>
          <ClientLayout>{children}</ClientLayout>
        </Provider>
      </body>
    </html>
  );
}
