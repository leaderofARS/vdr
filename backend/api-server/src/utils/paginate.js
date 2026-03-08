/**
 * @file paginate.js
 * @description Helper functions for standardizing server-side pagination across the API.
 */

/**
 * Parses and validates pagination and sorting parameters from the query string.
 * @param {Object} query - The Express request query object.
 * @param {Array} allowedSortFields - List of fields that are valid for sorting.
 * @param {String} defaultSortField - The fallback sort field if none provided or invalid.
 * @returns {Object} { page, limit, sortBy, sortOrder }
 * @throws {Error} If validation fails.
 */
function parsePagination(query, allowedSortFields = [], defaultSortField = 'createdAt', defaultLimit = 10) {
    let page = parseInt(query.page) || 1;
    let limit = parseInt(query.limit) || defaultLimit;
    let sortBy = query.sortBy || defaultSortField;
    let sortOrder = (query.sortOrder || 'desc').toLowerCase();
    const errors = [];

    if (isNaN(page) || page < 1) {
        errors.push('Page must be a positive integer greater than or eq to 1');
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
        errors.push('Limit must be an integer between 1 and 100');
    }

    if (allowedSortFields.length > 0 && !allowedSortFields.includes(sortBy)) {
        errors.push(`Invalid sortBy field. Allowed: ${allowedSortFields.join(', ')}`);
    }

    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
        errors.push('sortOrder must be either "asc" or "desc"');
    }

    if (errors.length > 0) {
        const error = new Error(errors.join('. '));
        error.status = 400;
        throw error;
    }

    return { page, limit, sortBy, sortOrder };
}

/**
 * Builds a standardized pagination response wrapper.
 * @param {Array} data - The array of records for the current page.
 * @param {Number} total - Total number of records across all pages.
 * @param {Number} page - Current page number.
 * @param {Number} limit - Records per page limit.
 * @returns {Object} Standardized response format.
 */
function buildPaginationResponse(data, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
}

/**
 * Applies pagination skip/take to a Prisma query object.
 * @param {Object} prismaQuery - The query object to modify.
 * @param {Number} page - Page number.
 * @param {Number} limit - Page limit.
 * @returns {Object} Modified query object with skip and take.
 */
function applyPagination(prismaQuery, page, limit) {
    return {
        ...prismaQuery,
        skip: (page - 1) * limit,
        take: limit
    };
}

module.exports = {
    parsePagination,
    buildPaginationResponse,
    applyPagination
};
