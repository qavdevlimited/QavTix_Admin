export const makeTrend = (current: number, changePercent: number): number[] => {
    if (!changePercent || isNaN(changePercent) || changePercent === 0) {
        return [current, current * 0.99, current * 1.01, current * 0.98, current]
    }

    const previous = current / (1 + changePercent / 100)
    const isUp = changePercent > 0

    if (isUp) {
        // Wavy upward curve — dips then rises to current
        return [
            previous,
            previous * 0.97,
            previous * 1.03,
            previous * 0.95,
            previous * 1.05,
            current * 0.98,
            current,
        ]
    } else {
        // Wavy downward curve — peaks then falls to current
        return [
            previous,
            previous * 1.03,
            previous * 0.97,
            previous * 1.05,
            previous * 0.95,
            current * 1.02,
            current,
        ]
    }
}