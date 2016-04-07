/**
 * This is the bridge between the view and the logic.
 */

// Example of how the file should work:

/**
 * Import the functions from the outside to the reducers.js
 */
export const SORT_BY = 'SORT_BY'
// More constants...

/**
 * Example function, just use the same syntax
 */
export function sortBy(key, asc) {
    return {
        type: SORT_BY,
        key: key,
        asc: asc
    }
}

// More functions...
