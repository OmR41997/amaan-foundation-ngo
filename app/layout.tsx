import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Amaan Ansari Welfare Foundation",
    template: "%s | Amaan Ansari Welfare Foundation",
  },
  description:
    "Amaan Ansari Welfare Foundation is a community-led NGO working for healthcare, education, dignity and long-term social impact.",
  metadataBase: new URL("https://amaanansariwelfare.org"),
  icons: {
    icon: {
      url: "/images/icons/cropped_circle_image.png",
      type: "image/png",
    },
    shortcut: {
      url: "/images/icons/cropped_circle_image.png",
      type: "image/png",
    },
    apple: {
      url: "/images/icons/cropped_circle_image.png",
      type: "image/png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

