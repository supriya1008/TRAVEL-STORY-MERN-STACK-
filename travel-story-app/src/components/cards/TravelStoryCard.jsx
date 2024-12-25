// import React from 'react';
// import { FaHeart } from 'react-icons/fa6';
// import { GrMapLocation } from 'react-icons/gr';

// const TravelStoryCard = ({
//   imgUrl,
//   title,
//   date,
//   story,
//   visitedLocation,
//   isFavourite,
//   onFavouriteClick,
//   onClick,
// }) => {
//   return (
//     <div className="">
//       <img
//         src={imgUrl}
//         alt={title}
//         className="w-full h-56 object-cover rounded-lg"
//         onClick={onClick}
//       />
//     </div>
//   );
// };

// export default TravelStoryCard;


import React from "react";
import { FaHeart } from "react-icons/fa";

const TravelStoryCard = ({
  imageUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick,
}) => {
  return (
    <div className="border rounded-lg shadow-lg p-4">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-56 object-cover rounded-lg cursor-pointer"
        onClick={onClick}
      />
      <div className="mt-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{new Date(date).toLocaleDateString()}</p>
        <p className="text-sm text-gray-600">{visitedLocation}</p>
        <p className="mt-2 text-gray-800">{story}</p>
        <div className="flex items-center justify-between mt-4">
          <button
            className={`flex items-center gap-1 ${
              isFavourite ? "text-red-500" : "text-gray-500"
            }`}
            onClick={onFavouriteClick}
          >
            <FaHeart />
            {isFavourite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
