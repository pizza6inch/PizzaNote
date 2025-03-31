import React from "react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  basePath = "/page",
}: BlogPaginationProps) {
  // Only show pagination if there's more than one page
  if (totalPages <= 1) return null;

  const renderPageLinks = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show the first page
    items.push(
      <PaginationItem key="first">
        {currentPage === 1 ? (
          <span className="pagination-link active" aria-current="page">1</span>
        ) : (
          <Link href="/" className="pagination-link">
            1
          </Link>
        )}
      </PaginationItem>
    );

    // Calculate range of visible page numbers
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

    if (endPage - startPage < maxVisiblePages - 3) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 3) + 1);
    }

    // Add ellipsis if needed
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          {i === currentPage ? (
            <span className="pagination-link active" aria-current="page">{i}</span>
          ) : (
            <Link href={`${basePath}/${i}`} className="pagination-link">
              {i}
            </Link>
          )}
        </PaginationItem>
      );
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show the last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          {currentPage === totalPages ? (
            <span className="pagination-link active" aria-current="page">{totalPages}</span>
          ) : (
            <Link href={`${basePath}/${totalPages}`} className="pagination-link">
              {totalPages}
            </Link>
          )}
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          {currentPage === 1 ? (
            <span className="pagination-link prev disabled" aria-disabled="true">Previous</span>
          ) : (
            <Link
              href={currentPage === 2 ? "/" : `${basePath}/${currentPage - 1}`}
              className="pagination-link prev"
            >
              Previous
            </Link>
          )}
        </PaginationItem>

        {/* Page Numbers */}
        {renderPageLinks()}

        {/* Next Button */}
        <PaginationItem>
          {currentPage === totalPages ? (
            <span className="pagination-link next disabled" aria-disabled="true">Next</span>
          ) : (
            <Link href={`${basePath}/${currentPage + 1}`} className="pagination-link next">
              Next
            </Link>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
