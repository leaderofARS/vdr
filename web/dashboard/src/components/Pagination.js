import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

/**
 * Reusable Pagination component with GCP-inspired aesthetic
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const showMax = 5;

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Logic for handling ellipsis
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <nav className="flex items-center justify-center gap-1 my-6" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-[#9AA0A6] hover:bg-[#1A1D24] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                aria-label="Previous Page"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) => {
                    if (page === 'ellipsis') {
                        return (
                            <span key={`ellipsis-${idx}`} className="px-2 text-[#5F6368]">
                                <MoreHorizontal className="w-4 h-4" />
                            </span>
                        );
                    }

                    const isActive = page === currentPage;
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-[#4285F4] text-white shadow-lg shadow-[#4285F4]/20'
                                    : 'text-[#9AA0A6] hover:bg-[#1A1D24] hover:text-[#E8EAED]'
                                }`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-[#9AA0A6] hover:bg-[#1A1D24] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                aria-label="Next Page"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </nav>
    );
};

export default Pagination;
