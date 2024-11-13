export function formatCount(value) {
    if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'b';
    } else if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    } else if (value >= 1_000) {
        return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
        return String(value);
    }
}
