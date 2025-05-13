import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Анализ уязвимостей смарт-контрактов",
  description: "Платформа для выявления уязвимостей в смарт-контрактах с помощью глубокого обучения",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
