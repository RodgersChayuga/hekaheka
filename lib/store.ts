// src/lib/store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ComicPage {
    imageUrl: string;
    text: string;
    character: string;
    userImageHash?: string;
}

interface WalletState {
    address: string;
    isConnected: boolean;
    isValid: boolean;
}

interface Store {
    wallet: WalletState | null;
    story: string;
    characters: string[];
    ipfsHash: string;
    comicPages: ComicPage[];
    setWallet: (wallet: Partial<WalletState> & { address: string }) => void;
    clearWallet: () => void;
    setStory: (story: string) => void;
    setCharacters: (characters: string[]) => void;
    setIpfsHash: (ipfsHash: string) => void;
    setComicPages: (pages: ComicPage[]) => void;
    reset: () => void;
}

export const useZustandStore = create<Store>()(
    persist(
        (set) => ({
            wallet: null,
            story: '',
            characters: [],
            ipfsHash: '',
            comicPages: [],
            setWallet: (wallet) =>
                set((state) => ({
                    wallet: state.wallet
                        ? { ...state.wallet, ...wallet }
                        : { ...wallet, isConnected: true, isValid: false },
                })),
            clearWallet: () => set({ wallet: null }),
            setStory: (story) => set({ story }),
            setCharacters: (characters) => set({ characters }),
            setIpfsHash: (ipfsHash) => set({ ipfsHash }),
            setComicPages: (comicPages) => set({ comicPages }),
            reset: () =>
                set({
                    story: '',
                    characters: [],
                    ipfsHash: '',
                    comicPages: [],
                }),
        }),
        {
            name: 'hekaheka-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                wallet: state.wallet,
                story: state.story,
                characters: state.characters,
                ipfsHash: state.ipfsHash,
                comicPages: state.comicPages,
            }),
        }
    )
);
