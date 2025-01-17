"use client"

import { useEffect, useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/dW5cSxDHKugtv5NxLTYyah8OLll0gn5q"
    ),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{mounted && children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
