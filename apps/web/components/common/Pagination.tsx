"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Colors } from "@repo/utils/constants/colors"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    loading?: boolean
}

/**
 * Generates page numbers with ellipsis for large page counts
 * Example: [1, 2, 3, 4, 5, 6, 7, '...', 3629] or [1, '...', 50, 51, 52, '...', 100]
 */
function getPageNumbers(
    currentPage: number,
    totalPages: number,
    maxVisible: number,
): (number | "...")[] {
    if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | "...")[] = []
    const halfVisible = Math.floor((maxVisible - 2) / 2) // -2 for first and last page

    // Always include first page
    pages.push(1)

    let startPage = Math.max(2, currentPage - halfVisible)
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible)

    // Adjust if we're near the beginning
    if (currentPage <= halfVisible + 2) {
        startPage = 2
        endPage = Math.min(totalPages - 1, maxVisible - 1)
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - halfVisible - 1) {
        startPage = Math.max(2, totalPages - maxVisible + 2)
        endPage = totalPages - 1
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
        pages.push("...")
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
        pages.push("...")
    }

    // Always include last page
    if (totalPages > 1) {
        pages.push(totalPages)
    }

    return pages
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    loading = false,
}: PaginationProps) {
    // Track window width for responsive behavior
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Show fewer pages on mobile
    const maxVisiblePages = isMobile ? 5 : 7

    const pageNumbers = useMemo(
        () => getPageNumbers(currentPage, totalPages, maxVisiblePages),
        [currentPage, totalPages, maxVisiblePages],
    )

    if (totalPages <= 1) return null

    const isPrevDisabled = currentPage === 1 || loading
    const isNextDisabled = currentPage === totalPages || loading

    return (
        <>
            <style>{`
                .pagination-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 6px;
                    margin-top: 32px;
                    flex-wrap: nowrap;
                    padding: 0 16px;
                }
                
                .pagination-btn {
                    min-width: 40px;
                    height: 40px;
                    padding: 8px 12px;
                    border-radius: 100px;
                    border: 1px solid ${Colors.border};
                    background-color: #ffffff;
                    color: ${Colors.text};
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .pagination-btn:hover:not(:disabled) {
                    background-color: ${Colors.neutral20};
                    border-color: ${Colors.neutral60};
                }
                
                .pagination-btn:disabled {
                    cursor: not-allowed;
                    opacity: 0.4;
                }
                
                .pagination-btn.active {
                    background-color: #000000;
                    color: #ffffff;
                    border-color: #000000;
                    font-weight: 600;
                    opacity: 1;
                }
                
                .pagination-btn.nav-btn {
                    padding: 8px 20px;
                    font-weight: 500;
                    color: ${Colors.text};
                }
                
                .pagination-btn.nav-btn:not(:disabled) {
                    border-color: ${Colors.neutral60};
                }
                
                .pagination-ellipsis {
                    min-width: 24px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${Colors.textSecondary};
                    font-size: 14px;
                    font-weight: 500;
                    user-select: none;
                    flex-shrink: 0;
                }
                
                .nav-btn-icon {
                    display: none;
                    font-size: 18px;
                    font-weight: 600;
                }
                
                /* Tablet - smaller buttons */
                @media (max-width: 768px) {
                    .pagination-container {
                        gap: 4px;
                        padding: 0 8px;
                    }
                    
                    .pagination-btn {
                        min-width: 36px;
                        height: 36px;
                        padding: 6px 10px;
                        font-size: 13px;
                    }
                    
                    .pagination-btn.nav-btn {
                        padding: 6px 14px;
                    }
                    
                    .pagination-ellipsis {
                        min-width: 20px;
                        height: 36px;
                        font-size: 13px;
                    }
                }
                
                /* Mobile - show arrows instead of text */
                @media (max-width: 480px) {
                    .pagination-container {
                        gap: 4px;
                        padding: 0 4px;
                        margin-top: 24px;
                    }
                    
                    .pagination-btn {
                        min-width: 32px;
                        height: 32px;
                        padding: 4px 8px;
                        font-size: 12px;
                    }
                    
                    .pagination-btn.nav-btn {
                        min-width: 32px;
                        padding: 4px 8px;
                    }
                    
                    .pagination-ellipsis {
                        min-width: 16px;
                        height: 32px;
                        font-size: 12px;
                    }
                    
                    .nav-btn-text {
                        display: none;
                    }
                    
                    .nav-btn-icon {
                        display: block;
                    }
                }
                
                /* Very small screens - minimal pagination */
                @media (max-width: 360px) {
                    .pagination-btn {
                        min-width: 28px;
                        height: 28px;
                        font-size: 11px;
                    }
                    
                    .pagination-ellipsis {
                        min-width: 12px;
                        height: 28px;
                        font-size: 11px;
                    }
                }
            `}</style>

            <nav className="pagination-container" aria-label="Pagination">
                {/* Previous Button */}
                <button
                    type="button"
                    className="pagination-btn nav-btn"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={isPrevDisabled}
                    aria-label="Previous page"
                >
                    <span className="nav-btn-text">Prev</span>
                    <span className="nav-btn-icon">‹</span>
                </button>

                {/* Page Numbers */}
                {pageNumbers.map((page, index) =>
                    page === "..." ? (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            className={`pagination-btn${page === currentPage ? " active" : ""}`}
                            onClick={() => onPageChange(page)}
                            disabled={loading || page === currentPage}
                            aria-label={`Page ${page}`}
                            aria-current={page === currentPage ? "page" : undefined}
                        >
                            {page}
                        </button>
                    ),
                )}

                {/* Next Button */}
                <button
                    type="button"
                    className="pagination-btn nav-btn"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={isNextDisabled}
                    aria-label="Next page"
                >
                    <span className="nav-btn-text">Next</span>
                    <span className="nav-btn-icon">›</span>
                </button>
            </nav>
        </>
    )
}

export default Pagination

