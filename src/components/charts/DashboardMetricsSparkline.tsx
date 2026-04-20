"use client";

import { useMemo } from "react";

interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    theme: {
        trendPositive: string;
        trendNegative: string;
    };
    isPositive: boolean;
}

export default function DashboardMetricSparkline({
    data,
    width = 90,
    height = 30,
    theme,
    isPositive,
}: SparklineProps) {
    const strokeColor = isPositive ? theme.trendPositive : theme.trendNegative;

    const { pathData, lastX, lastY } = useMemo(() => {
        if (!data || data.length < 2) return { pathData: "", lastX: 0, lastY: 0 };

        const clean = data.map(v => (isFinite(v) ? v : 0))

        const min = Math.min(...clean);
        const max = Math.max(...clean);
        const range = max - min || 1;
        const padding = 4;
        const innerHeight = height - padding * 2;

        const points = clean.map((val, i) => ({
            x: (i / (clean.length - 1)) * width,
            y: padding + (innerHeight - ((val - min) / range) * innerHeight),
        }));

        const d = points.reduce((acc, point, i) => {
            if (i === 0) return `M ${point.x},${point.y}`;
            const prev = points[i - 1];
            const cpx = (prev.x + point.x) / 2;
            return `${acc} C ${cpx},${prev.y} ${cpx},${point.y} ${point.x},${point.y}`;
        }, "");

        const last = points[points.length - 1];
        return {
            pathData: d,
            lastX: isFinite(last.x) ? last.x : 0,
            lastY: isFinite(last.y) ? last.y : 0,
        };
    }, [data, width, height]);

    if (!pathData) return null;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <path
                d={pathData}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx={lastX}
                cy={lastY}
                r="3.5"
                fill={strokeColor}
            />
        </svg>
    );
}