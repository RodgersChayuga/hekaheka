// components/Header.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, MessageCircle, LogOut } from "lucide-react";
import { useZustandStore } from "@/lib/store";
import { useDisconnect } from "wagmi";

const Header = () => {
    type MenuItem = "HOME" | "HOW IT WORKS" | "MINT" | "MARKETPLACE";
    const menuLinks: Record<MenuItem, string> = {
        HOME: "/",
        "HOW IT WORKS": "/how-it-works",
        MINT: "/mint",
        MARKETPLACE: "/marketplace",
    };

    const wallet = useZustandStore((state) => state.wallet);
    const clearWallet = useZustandStore((state) => state.clearWallet);
    const { disconnect } = useDisconnect();

    const handleDisconnect = () => {
        disconnect();
        clearWallet();
        window.location.href = "/";
    };

    return (
        <header className="z-50 sticky">
            <nav className="fixed w-full shadow-sm z-50 py-4 bg-white/40">
                <div className="container mx-auto flex items-center justify-around h-16 px-4 relative">
                    {/* Left Menu Items */}
                    <div className="flex items-center gap-4">
                        {(["HOME", "HOW IT WORKS", "MINT", "MARKETPLACE"] as MenuItem[]).map((item) => (
                            <Link
                                key={item}
                                href={menuLinks[item]}
                                className="text-xl font-permanent-marker hover:bg-transparent text-black hover:text-yellow-500 p-2 rounded-md transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Center Logo */}
                    <div className="absolute left-1/2 transform -translate-x-3">
                        <Link href="/">
                            <div className="w-20 h-20 relative hover:cursor-pointer">
                                <Image
                                    src="/images/comic_thunder.png"
                                    alt="ComicChain logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Wallet Address */}
                        {wallet?.isConnected && (
                            <div className="flex items-center gap-2 mr-4">
                                <span className="text-sm font-medium bg-yellow-100 px-2 py-1 rounded">
                                    {`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleDisconnect}
                                    className="w-8 h-8 hover:bg-transparent hover:text-yellow-500"
                                    title="Disconnect Wallet"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* Social Icons */}
                        <div className="flex gap-3">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 hover:text-yellow-500">
                                <Instagram />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 hover:text-yellow-500">
                                <Facebook />
                            </a>
                            <a href="https://wa.me/254720033411" target="_blank" rel="noopener noreferrer" className="w-6 h-6 hover:text-yellow-500">
                                <MessageCircle />
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
