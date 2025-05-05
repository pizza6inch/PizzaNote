import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

const PaginationComponent = ({
  currentPage = 4,
  totalPages = 10,
  setPages,
}: {
  currentPage: number;
  totalPages: number;
  setPages: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPages(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        </PaginationItem>

        {/* 显示第一页 */}
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink href="#" onClick={() => handlePageChange(1)}>
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 显示省略号 */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* 显示当前页前一页 */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink href="#" onClick={() => handlePageChange(currentPage - 1)}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 显示当前页 */}
        <PaginationItem>
          <PaginationLink className=" bg-red cursor-auto" onClick={() => handlePageChange(currentPage)}>
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {/* 显示当前页后一页 */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink href="#" onClick={() => handlePageChange(currentPage + 1)}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 显示省略号 */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* 显示最后一页 */}
        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink href="#" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handlePageChange(currentPage + 1)}
            // disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
