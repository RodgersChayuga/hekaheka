export type Position = {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    animationDelay?: string;
};

export type CloudConfig = {
    position: Position;
    size: {
        width: string;
        height: string;
    };
    zIndex?: number;
    className?: string;
};

export type SunConfig = {
    position: Position;
    size: {
        width: string;
        height: string;
    };
    zIndex?: number;
    className?: string;
    image: string;
};

export interface BackgroundConfig {
    starPositions: Array<{
        top: string;
        left: string;
        animationDelay?: string;
    }>;
    animationVariants: string[];
    clouds: {
        one: {
            position: { top?: string; bottom?: string; left?: string; right?: string };
            size: { width: string; height: string };
            zIndex?: number;
            className?: string;
        };
        two: {
            position: { top?: string; bottom?: string; left?: string; right?: string };
            size: { width: string; height: string };
            zIndex?: number;
            className?: string;
        };
    };
    suns: {
        left: {
            position: { top?: string; bottom?: string; left?: string; right?: string };
            size: { width: string; height: string };
            zIndex?: number;
            className?: string;
            image: string;
        };
        right: {
            position: { top?: string; bottom?: string; left?: string; right?: string };
            size: { width: string; height: string };
            zIndex?: number;
            className?: string;
            image: string;
    };
};
}