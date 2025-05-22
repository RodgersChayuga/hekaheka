// File: app/comic-preview/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useZustandStore } from "@/lib/store";
import ComicPreview, { ComicPage } from "./ComicPreview";

const ComicPreviewPage = () => {
    const { story, characters } = useZustandStore();
    const [comicPages, setComicPages] = useState<ComicPage[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchComicPages = async () => {
            if (!story || characters.length === 0) return;

            setLoading(true);
            try {
                const res = await fetch("/api/generate-comic", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ story, characters }),
                });

                if (!res.ok) {
                    throw new Error("Comic generation failed.");
                }

                const data: ComicPage[] = await res.json();
                setComicPages(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchComicPages();
    }, [story, characters]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-4">Your Comic Preview</h1>
            {loading ? (
                <div className="text-center text-muted-foreground">Generating comic...</div>
            ) : (
                <ComicPreview pages={comicPages} />
            )}
        </div>
    );
};

export default ComicPreviewPage;
