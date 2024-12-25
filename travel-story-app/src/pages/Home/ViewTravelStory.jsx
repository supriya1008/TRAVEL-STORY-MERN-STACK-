import React from "react";
import { GrMapLocation } from "react-icons/gr";
import { MdUpdate, MdDeleteOutline, MdClose } from "react-icons/md";
import moment from "moment";

const ViewTravelStory = ({ storyInfo, onClose, onEditClick, onDeleteClick }) => {
  if (!storyInfo) {
    return <p className="text-center text-gray-500">No story information available.</p>;
  }

  const { title, visitedDate, visitedLocation, imageUrl, story } = storyInfo;

  return (
    <div className="relative">
      {/* Action Buttons */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-lg">
          <button className="btn-small" onClick={onEditClick}>
            <MdUpdate className="text-lg" /> UPDATE STORY
          </button>
          <button className="btn-small btn-delete" onClick={onDeleteClick}>
            <MdDeleteOutline className="text-lg" /> DELETE STORY
          </button>
          <button className="btn-small" onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>
      </div>

      {/* Story Content */}
      <div>
        {/* Title */}
        <div className="flex-1 flex flex-col gap-2 py-4">
          <h1 className="text-2xl text-slate-950">{storyInfo && storyInfo.title}</h1>
          <span className="text-xs text-slate-500">
            {storyInfo && storyInfo.visitedDate
              ? moment(storyInfo.visitedDate).format("Do MMM YYYY")
              : "Date not available"}
          </span>

          <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py">
            <GrMapLocation className="text-sm" />
            {storyInfo &&
              storyInfo.visitedLocation.map((item, index) =>
                storyInfo.visitedLocation.length === index + 1
                  ? `${item}`
                  : `${item}, `
              )}
          </div>
        </div>

        {storyInfo && storyInfo.imageUrl ? (
          <img
            src={storyInfo.imageUrl}
            alt="Selected"
            className="w-full h-[300px] object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 rounded-lg">
            <p className="text-gray-500">No image available</p>
          </div>
        )}

        {/* Story Description */}
        <div className="mt-4">
          <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">
            {storyInfo.story}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewTravelStory;
