// src/lib/store.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Represents a page in the generated comic
interface ComicPage {
    imageUrl: string;
    text: string;
    character: string;
    userImageHash?: string;
}

// Represents the connected wallet information
interface WalletState {
    address: string;
    isConnected: boolean;
    isValid: boolean;
}

// Zustand global store structure
interface Store {
    // Wallet state
    wallet: WalletState | null;

    // User-defined story and characters
    story: string;
    characters: string[];

    // IPFS hash of uploaded storybook
    ipfsHash: string;

    // Comic pages generated from story + characters
    comicPages: ComicPage[];

    // One image per character (key = character name, value = image URL/base64)
    characterImages: Record<string, string>;

    // Wallet update methods
    setWallet: (wallet: Partial<WalletState> & { address: string }) => void;
    clearWallet: () => void;

    // Story and character methods
    setStory: (story: string) => void;
    setCharacters: (characters: string[]) => void;

    // IPFS + ComicPages
    setIpfsHash: (ipfsHash: string) => void;
    setComicPages: (pages: ComicPage[]) => void;

    // Character image methods
    setCharacterImages: (images: Record<string, string>) => void; // bulk update
    setCharacterImage: (character: string, imageUrl: string) => void; // update one

    // Reset session (clears everything except wallet)
    reset: () => void;
}

// Zustand store with persistence in localStorage
export const useZustandStore = create<Store>()(
    persist(
        (set) => ({
            wallet: null,
            story: '',
            characters: [],
            ipfsHash: '',
            comicPages: [],
            characterImages: {},

            // Merge new wallet values with existing or create new with defaults
            setWallet: (wallet) =>
                set((state) => ({
                    wallet: state.wallet
                        ? { ...state.wallet, ...wallet }
                        : { ...wallet, isConnected: true, isValid: false },
                })),

            clearWallet: () => set({ wallet: null }),

            // Setters for story, characters, IPFS hash and comic pages
            setStory: (story) => set({ story }),
            setCharacters: (characters) => set({ characters }),
            setIpfsHash: (ipfsHash) => set({ ipfsHash }),
            setComicPages: (comicPages) => set({ comicPages }),

            // Replaces all character images at once
            setCharacterImages: (images) => set({ characterImages: images }),

            // Sets or replaces image for a single character
            setCharacterImage: (character, imageUrl) =>
                set((state) => ({
                    characterImages: {
                        ...state.characterImages,
                        [character]: imageUrl,
                    },
                })),

            // Resets story-related state (keeps wallet untouched)
            reset: () =>
                set({
                    story: '',
                    characters: [],
                    ipfsHash: '',
                    comicPages: [],
                    characterImages: {},
                }),
        }),
        {
            name: 'hekaheka-store', // Storage key in localStorage
            storage: createJSONStorage(() => localStorage),

            // Define what parts of the state should persist
            partialize: (state) => ({
                wallet: state.wallet,
                story: state.story,
                characters: state.characters,
                ipfsHash: state.ipfsHash,
                comicPages: state.comicPages,
                characterImages: state.characterImages,
            }),
        }
    )
);
