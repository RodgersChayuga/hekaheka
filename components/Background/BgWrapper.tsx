'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useMemo } from 'react'
import Background from './index'
import { backgroundConfigs } from './bg-configs'

const BgWrapper = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname()

    // Use useMemo to ensure consistent config selection
    const backgroundType = useMemo(() => {
        const path = pathname.split('/')[1] || 'home'

        // Map to your defined background types
        switch (path) {
            case 'checkout':
                return 'checkout'
            case 'edit-comic':
                return 'editComic'
            case 'how-it-works':
                return 'howItWorks'
            case 'image-upload':
                return 'imageUpload'
            case 'mint':
                return 'mint'
            case 'marketplace':
                return 'marketplace'
            case 'story-input':
                return 'storyInput'
            default:
                return 'home'
        }
    }, [pathname])

    return (
        <Background config={backgroundConfigs[backgroundType]}>
            {children}
        </Background>
    )
}

export default BgWrapper