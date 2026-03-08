import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });

export const metadata = {
  title: "SAROMEN | Luxury Candle Store",
  description: "Premium candle ecommerce storefront by SAROMEN."
};

export default function RootLayout({ children }) {
  return (
    <html lang="sl">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
