import React, { useState } from "react";
import { MdAdd, MdClose, MdUpdate } from "react-icons/md";
import DataSelector from "../../components/Input/DataSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import uploadImage from "../../utils/uploadImage";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.image || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
  const [error, setError] = useState("");

  const validateInputs = () => {
    if (!title) {
      setError("Please enter the title");
      return false;
    }
    if (!story) {
      setError("Please enter the story");
      return false;
    }
    if (visitedLocation.length === 0) {
      setError("Please select at least one visited location.");
      return false;
    }
    setError("");
    return true;
  };

  const addNewTravelStory = async () => {
    try {
      if (!validateInputs()) return;

      let imageUrl = "";
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl,
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.data?.story) {
        toast.success("Story added successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      console.error("Error adding travel story:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      if (!validateInputs()) return;

      let imageUrl = storyInfo.imageUrl || "";
      if (typeof storyImg === "object") {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.put(`/edit-story/${storyId}`, {
        title,
        story,
        imageUrl,
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.data?.story) {
        toast.success("Story updated successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      console.error("Error updating travel story:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleDeleteStoryImg = async () => {
    try {
      if (!storyInfo?.imageUrl) return;

      const deleteImgRes = await axiosInstance.delete("/delete-image", {
        params: { imageUrl: storyInfo.imageUrl },
      });

      if (deleteImgRes.data) {
        setStoryImg(null);
        toast.success("Image deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete the image. Please try again.");
    }
  };

  const handleAddOrUpdateClick = () => {
    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" /> ADD STORY
              </button>
            ) : (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdUpdate className="text-lg" /> UPDATE STORY
              </button>
            )}
            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 pt-4">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="A Day at the Great Wall"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div className="my-3">
        <DataSelector date={visitedDate} setDate={setVisitedDate} />
      </div>
      <ImageSelector
        image={storyImg}
        setImage={setStoryImg}
        handleDeleteImg={handleDeleteStoryImg}
      />
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">STORY</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Your Story"
          rows={10}
          value={story}
          onChange={({ target }) => setStory(target.value)}
        />
      </div>
      <div className="pt-3">
        <label className="input-label">VISITED LOCATIONS</label>
        <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
      </div>
    </div>
  );
};

export default AddEditTravelStory;
