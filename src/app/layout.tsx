import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/common/components/Header";
import { ServiceProvider } from "@/features/services/application/ServiceContext";
import { BookingProvider } from "@/features/bookings/application/BookingContext";
import { AvailabilityProvider } from "@/features/availability/application/AvailabilityContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barber Booking Platform",
  description: "Book your barber appointment online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-slate-50">
        <ServiceProvider>
          <BookingProvider>
            <AvailabilityProvider>
              <Header />
              <main className="flex-1">{children}</main>
            </AvailabilityProvider>
          </BookingProvider>
        </ServiceProvider>
      </body>
    </html>
  );
}
