// components/HydrationZustandWrapper.tsx
"use client";

import { useEffect, useState } from "react";

export default function HydrationZustandWrapper({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return isHydrated ? <>{children}</> : null;
}
