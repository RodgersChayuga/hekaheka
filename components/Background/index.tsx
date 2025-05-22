"use client"

import Image from "next/image";
import { BackgroundConfig } from "@/types/background";
import Header from "../Header";

interface BackgroundProps {
    children: React.ReactNode;
    config: BackgroundConfig;
}

const Background = ({ children, config }: BackgroundProps) => {

    return (
        <div className="relative h-screen overflow-hidden">
            {/* Fixed Background Elements */}
            <div className="fixed inset-0 -z-10 bg-comic-pattern animate-comic-fade">
                {/* Clouds */}
                {config?.clouds?.one && (
                    <div
                        className={`absolute ${config.clouds.one?.className || ""}`}
                        style={{
                            top: config.clouds.one?.position?.top,
                            left: config.clouds.one?.position?.left,
                            right: config.clouds.one?.position?.right,
                            bottom: config.clouds.one?.position?.bottom,
                            width: config.clouds.one?.size?.width,
                            height: config.clouds.one?.size?.height,
                            zIndex: config.clouds.one?.zIndex,
                        }}
                    >
                        <Image
                            src="/images/comic_cloud.png"
                            alt="Bottom left cloud"
                            fill
                            className="animate-float object-contain"
                            loading="eager"
                            priority
                        />
                    </div>
                )}

                {config?.clouds?.two && (
                    <div
                        className={`absolute ${config.clouds.two?.className || ""}`}
                        style={{
                            top: config.clouds.two?.position?.top,
                            left: config.clouds.two?.position?.left,
                            right: config.clouds.two?.position?.right,
                            bottom: config.clouds.two?.position?.bottom,
                            width: config.clouds.two?.size?.width,
                            height: config.clouds.two?.size?.height,
                            zIndex: config.clouds.two?.zIndex,
                        }}
                    >
                        <Image
                            src="/images/comic_cloud.png"
                            alt="Bottom right cloud"
                            fill
                            className="animate-float"
                        />
                    </div>
                )}

                {/* Floating Stars */}
                {config.starPositions.map((position, i) => {
                    const animationDurations = [1.2, 1.5, 1.8, 2.0, 2.3, 2.5, 2.8, 3.0, 3.2, 3.5];
                    const pulseTypes = ['pulse-star', 'pulse-star-slow', 'pulse-star-fast'];

                    const duration = animationDurations[i % animationDurations.length];
                    const pulseType = pulseTypes[i % pulseTypes.length];
                    const delay = position.animationDelay || `${(i * 0.3) % 2.5}s`;

                    return (
                        <div
                            key={`star-${i}`}
                            className="absolute w-10 h-10"
                            style={{
                                top: position.top,
                                left: position.left,
                                animation: `${pulseType} ${duration}s ease-in-out infinite`,
                                animationDelay: delay,
                            }}
                        >
                            <Image
                                src="/images/comic_star.png"
                                alt="Yellow star element"
                                fill
                                className="object-contain"
                                loading={i < 4 ? "eager" : "lazy"}
                                priority={i < 4}
                            />
                        </div>
                    );
                })}

                {/* Comic Suns */}
                {config?.suns?.left && (
                    <div
                        className={`absolute ${config.suns.left?.className || ""}`}
                        style={{
                            top: config.suns.left?.position?.top,
                            left: config.suns.left?.position?.left,
                            right: config.suns.left?.position?.right,
                            bottom: config.suns.left?.position?.bottom,
                            width: config.suns.left?.size?.width,
                            height: config.suns.left?.size?.height,
                            zIndex: config.suns.left?.zIndex,
                        }}
                    >
                        <Image
                            src={config.suns.left?.image || "/images/comic_sun.png"}
                            alt="Smaller sun at top left"
                            fill
                            className="animate-float object-contain"
                            loading="eager"
                            priority
                        />
                    </div>
                )}

                {config?.suns?.right && (
                    <div
                        className={`absolute ${config.suns.right?.className || ""}`}
                        style={{
                            top: config.suns.right?.position?.top,
                            left: config.suns.right?.position?.left,
                            right: config.suns.right?.position?.right,
                            bottom: config.suns.right?.position?.bottom,
                            width: config.suns.right?.size?.width,
                            height: config.suns.right?.size?.height,
                            zIndex: config.suns.right?.zIndex,
                        }}
                    >
                        <Image
                            src={config.suns.right?.image || "/images/comic_sun.png"}
                            alt="Large sun at top right"
                            fill
                            className="animate-float"
                        />
                    </div>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="relative z-30 h-screen flex flex-col">
                <main className="flex-1 overflow-y-auto">
                    <Header />
                    <div className="container mx-auto mt-60">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Background;