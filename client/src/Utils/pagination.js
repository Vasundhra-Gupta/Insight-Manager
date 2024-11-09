import { useCallback } from 'react';

export default function paginate(hasNextPage, loading, setPage) {
    let observer;
    return useCallback(
        (node) => {
            if (loading) return;
            if (observer) observer.disconnect();
            observer = new IntersectionObserver((entries) => {
                const lastPost = entries[0];
                if (lastPost.isIntersecting && hasNextPage) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observer.observe(node);
        },
        [hasNextPage]
    );
}
