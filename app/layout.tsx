import { ReactNode } from 'react'

// Root layout должен быть минимальным для Next.js
// Основной layout находится в app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}

