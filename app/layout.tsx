import type { Metadata } from "next";
import "./globals.css";
import NavbarWrapper from "./Component/layout/NavbarWrapper";

export const metadata: Metadata = {
  title: "Meco - Car Care Made Simple",
  description:
    "Book trusted car services, anytime, anywhere. We bring quality service to your doorstep.",
     icons: {
    icon: "/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full flex flex-col">
       <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}