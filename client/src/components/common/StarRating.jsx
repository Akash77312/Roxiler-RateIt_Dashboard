import React from "react";

function Star({ filled, onClick, size = 24, readOnly }) {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      className={`${filled ? "text-yellow-400" : "text-gray-400"} ${!readOnly ? "cursor-pointer" : ""}`}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function StarRating({ rating, setRating, size = 24, readOnly = false }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <Star
            key={index}
            size={size}
            filled={ratingValue <= rating}
            onClick={!readOnly && setRating ? () => setRating(ratingValue) : undefined}
            readOnly={readOnly}
          />
        );
      })}
    </div>
  );
}
