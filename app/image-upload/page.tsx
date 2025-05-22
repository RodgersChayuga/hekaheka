"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CustomButton from "@/components/CustomButton";
import PhotoUpload from "./upload";
import { useZustandStore } from "@/lib/store";

import { fileToBase64 } from "@/lib/utils"; // ⬅️ Import the helper

const ImageUpload = () => {
    const router = useRouter();
    const { characters, story, setCharacterImage } = useZustandStore();
    const [characterFiles, setCharacterFiles] = useState<Record<string, File[]>>({});
    const [isLoading, setIsLoading] = useState(false);

    const updateCharacterFiles = (character: string, files: File[]) => {
        setCharacterFiles(prev => ({
            ...prev,
            [character]: files
        }));
    };

    // const HandleCreateComic = async () => {
    //     console.log("🚀 Starting comic generation with the following inputs:");
    //     console.log("🧙‍♂️ Characters:", characters);
    //     console.log("📖 Story:", story);

    //     if (!characters.every(c => characterFiles[c]?.length > 0)) {
    //         toast.error("⚠️ Please upload at least one image per character before generating.");
    //         return;
    //     }

    //     setIsLoading(true); // ✅ Start loading

    //     try {
    //         console.log("🖼️ Uploaded Files per Character:");
    //         for (const character of characters) {
    //             const files = characterFiles[character] || [];
    //             console.log(`  - ${character}:`, files.map(f => f.name));

    //             if (files.length > 0) {
    //                 try {
    //                     const base64 = await fileToBase64(files[0]); // Only using first file per character
    //                     setCharacterImage(character, base64); // Save to Zustand
    //                 } catch (err) {
    //                     toast.error(`❌ Failed to convert image for ${character}`);
    //                     console.error(err);
    //                 }
    //             }
    //         }
    //         toast.success("✅ All character images converted to base64 and saved!");
    //         router.push("/comic-preview");
    //     } catch (err) {
    //         toast.error("⚠️ Error occurred during image conversion.");
    //         console.error(err);
    //     } finally {
    //         setIsLoading(false); // ✅ End loading regardless of success/failure
    //     }
    // };

    const generateComicPages = async (story: string, characters: string[]) => {
        const response = await fetch("/api/generate-comic", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ story, characters }),
        });

        if (!response.ok) {
            throw new Error("❌ Comic generation failed.");
        }

        const result = await response.json(); // Expected format: [{ text, character }, ...]
        return result;
    };


    const HandleCreateComic = async () => {
        console.log("🚀 Starting comic generation with the following inputs:");
        console.log("🧙‍♂️ Characters:", characters);
        console.log("📖 Story:", story);

        if (!characters.every(c => characterFiles[c]?.length > 0)) {
            toast.error("⚠️ Please upload at least one image per character before generating.");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Convert and store character images
            for (const character of characters) {
                const files = characterFiles[character] || [];
                if (files.length > 0) {
                    try {
                        const base64 = await fileToBase64(files[0]);
                        setCharacterImage(character, base64);
                    } catch (err) {
                        toast.error(`❌ Failed to convert image for ${character}`);
                        console.error(err);
                    }
                }
            }

            toast.success("✅ Character images saved!");

            // 2. Call OpenAI API to generate comic pages
            const generatedPages = await generateComicPages(story, characters); // [{ text, character }]
            console.log("📝 Generated comic pages:", generatedPages);

            // 3. Add imageBase64 from state to each page based on character
            const { characterImages, setComicPages } = useZustandStore.getState();
            const pagesWithImages = generatedPages.map((page: any) => ({
                ...page,
                imageBase64: characterImages[page.character] || "", // fallback if not found
            }));

            // 4. Save to Zustand store
            setComicPages(pagesWithImages);

            toast.success("🎉 Comic pages generated!");
            router.push("/comic-preview");
        } catch (err) {
            toast.error("⚠️ Error occurred during comic generation.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="flex flex-col gap-8 p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center">
                Upload Character Images
            </h1>

            {characters.length === 0 ? (
                <div className="p-4 bg-yellow-100 border border-yellow-300 rounded mb-4 text-center">
                    No characters found. Please go back and add character names.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((character) => (
                        <div key={character}>
                            <PhotoUpload
                                character={character}
                                files={characterFiles[character] || []}
                                setFiles={(files) => updateCharacterFiles(character, files)}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center space-y-2 text-sm text-muted-foreground">
                <p>Upload high-quality images for best results</p>
                <p>Supported formats: JPEG, PNG (max 5MB each)</p>
            </div>

            <div className="flex justify-center gap-4 mt-4">
                <CustomButton
                    onClick={() => router.back()}
                    className=" "
                >
                    Back
                </CustomButton>

                <CustomButton
                    onClick={HandleCreateComic}
                    className={characters.length === 0 ? "bg-black text-white" : ""}
                    disabled={isLoading || characters.length === 0 || !characters.every(c => characterFiles[c]?.length > 0)}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                            Generating...
                        </div>
                    ) : "Create Comic"}
                </CustomButton>
            </div>
        </div>
    );
};

export default ImageUpload;