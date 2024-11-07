export function verifyOrderBy(orderBy) {
    const validOrderBy = ['ASC', 'DESC'];
    if (!validOrderBy.includes(orderBy.toUpperCase())) {
        throw new Error('INVALID_ORDERBY_VALUE');
    }
    return true;
}
