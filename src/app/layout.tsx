import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rido — AI Income Protection',
  description: 'Autonomous income protection for quick-commerce delivery workers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
