"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function SignupQueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () => new QueryClient({ defaultOptions: { mutations: { retry: false } } })
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}