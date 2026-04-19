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

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const padding = 4;
        const innerHeight = height - padding * 2;

        const points = data.map((val, i) => ({
            x: (i / (data.length - 1)) * width,
            y: padding + (innerHeight - ((val - min) / range) * innerHeight),
        }));

        // Build smooth cubic bezier path
        // For each segment, control points are 1/3 of the way toward neighbors
        const d = points.reduce((acc, point, i) => {
            if (i === 0) return `M ${point.x},${point.y}`;

            const prev = points[i - 1];
            const cpx = (prev.x + point.x) / 2;

            // Use horizontal control points for smooth tension
            const cp1x = cpx;
            const cp1y = prev.y;
            const cp2x = cpx;
            const cp2y = point.y;

            return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
        }, "");

        const last = points[points.length - 1];
        return { pathData: d, lastX: last.x, lastY: last.y };
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