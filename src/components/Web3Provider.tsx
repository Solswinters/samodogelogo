"use client";

import React, { ReactNode } from "react";
import { WagmiProvider, State } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { config, queryClient } from "@/lib/web3";

export default function Web3Provider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

