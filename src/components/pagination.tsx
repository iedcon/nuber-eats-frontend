import React from "react";

interface IPaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages?: number;
}

export const Pagination: React.FC<IPaginationProps> = ({
  page,
  setPage,
  totalPages,
}) => {
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  if (!totalPages) {
    return <div></div>;
  }
  return (
    <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
      {page > 1 ? (
        <button
          role="button"
          onClick={onPrevPageClick}
          className="focus:outline-none font-medium text-2xl"
        >
          &larr;
        </button>
      ) : (
        <div></div>
      )}
      <span>
        Page {page} of {totalPages}
      </span>
      {page !== totalPages ? (
        <button
          role="button"
          onClick={onNextPageClick}
          className="focus:outline-none font-medium text-2xl"
        >
          &rarr;
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
};
