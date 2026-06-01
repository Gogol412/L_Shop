export function averageRating(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    return Math.round(average * 10) / 10;
}
export function reviewsForProduct(reviews, productId) {
    return reviews
        .filter((review) => review.productId === productId)
        .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}
//# sourceMappingURL=ratings.js.map