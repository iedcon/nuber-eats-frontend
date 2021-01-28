import React from "react";
import { Link } from "react-router-dom";

interface ICategoryProps {
  id: string;
  coverImg?: string;
  name: string;
  slug: string;
}

export const Category: React.FC<ICategoryProps> = ({
  coverImg,
  name,
  slug,
}) => (
  <Link to={`/category/${slug}`}>
    <div className="flex flex-col group items-center cursor-pointer">
      <div
        className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
        style={{ backgroundImage: `url(${coverImg})` }}
      ></div>
      <span className="mt-1 text-sm text-center font-medium">{name}</span>
    </div>
  </Link>
);
