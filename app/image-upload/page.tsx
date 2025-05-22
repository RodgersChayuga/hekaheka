"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CustomButton from "@/components/CustomButton";
import PhotoUpload from "./upload";
import { useZustandStore } from "@/lib/store";

const ImageUpload = () => {
    const router = useRouter();
    const { characters, story } = useZustandStore();
    const [characterFiles, setCharacterFiles] = useState<Record<string, File[]>>({});
    const [isLoading, setIsLoading] = useState(false);

    const updateCharacterFiles = (character: string, files: File[]) => {
        setCharacterFiles(prev => ({
            ...prev,
            [character]: files
        }));
    };

    const HandleCreateComic = () => {
        console.log("🚀 Starting comic generation with the following inputs:");

        console.log("🧙‍♂️ Characters:", characters);
        console.log("📖 Story:", story);

        console.log("🖼️ Uploaded Files per Character:");
        characters.forEach((character) => {
            const files = characterFiles[character] || [];
            console.log(`  - ${character}:`, files.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })));
        });
    }

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
                    {isLoading ? "Generating..." : "Create Comic"}
                </CustomButton>
            </div>
        </div>
    );
};

export default ImageUpload;