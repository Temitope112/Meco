import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Component/layout/navbar";

export const metadata: Metadata = {
  title: "CarFix - Car Care Made Simple",
  description:
    "Book trusted car services, anytime, anywhere. We bring quality service to your doorstep.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}