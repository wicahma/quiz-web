import ReduxProvider from "@/src/store/providers";
import "./globals.css";
import type { Metadata } from "next";
import Peringatan from "@/src/micros/peringatan";
import LoadingSpin from "@/src/micros/spinner";

export const metadata: Metadata = {
  title: "Kuisis",
  description: "Kuisis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <ReduxProvider>
        <body>
          <Peringatan />
          <LoadingSpin />
          {children}
        </body>
      </ReduxProvider>
    </html>
  );
}
