import { Jersey_10 } from "next/font/google";
import "./globals.css";

const jersey = Jersey_10({
  variable: "--font-jersey",
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: 'Retro MC | %s',
    default: 'Retro MC | Home',
  },
  description: 'Equip your legendary gear.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jersey.variable}>
      <body>{children}</body>
    </html>
  );
}
