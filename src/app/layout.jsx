import { Jersey_10, Pixelify_Sans } from "next/font/google";
import "./globals.css";

const jersey = Jersey_10({
  variable: "--font-jersey",
  weight: "400",
  subsets: ["latin"],
});

const pixelify = Pixelify_Sans({
  variable: "--font-title-face",
  weight: ["500", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: 'Retro MC | %s',
    default: 'Retro MC | Home',
  },
  description: 'Equip your legendary gear.',
};

export const viewport = {
  themeColor: '#1b1530',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jersey.variable} ${pixelify.variable}`}>
      <body>{children}</body>
    </html>
  );
}
