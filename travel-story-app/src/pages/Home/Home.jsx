import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/cards/TravelStoryCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAdd } from "react-icons/md";
import AddEditTravelStory from "./AddEditTravelStory";
import Modal from "react-modal";
import ViewTravelStory from "./ViewTravelStory";
import EmptyImg from "../../assets/images/EmptyImg.png";
import EmptyCard from "../../components/cards/EmptyCard";


const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search query
  const [filterType, setFilterType] = useState(""); // Correct placement of useState
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
    }
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  // Handler for editing a story
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });
  };

  // Handler for viewing a story
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  // Update the 'isFavourite' status for a story
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put(
        `/update-is-favourite/${storyId}`,
        { isFavourite: !storyData.isFavourite }
      );
      if (response.data && response.data.story) {
        toast.success("Story updated successfully");
        getAllTravelStories();
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
    }
  };

  // Delete a travel story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-story/${storyId}`);
      if (response.data && !response.data.error) {
        toast.success("Story deleted successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      } else {
        toast.error("Failed to delete the story.");
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
      toast.error("An error occurred while deleting the story.");
    }
  };
  const onSearchStory = async (query) => {
    if (!query) return; // Optional: Prevent search if the query is empty
    try {
      const response = await axiosInstance.get("/search", {
        params: { query },
      });
      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
    }
  };
  

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imageUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation.join(", ")}
                    isFavourite={item.isFavourite}
                    onEdit={() => handleEdit(item)}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                imgSrc={EmptyImg}
                message={`start creating you first Travel story! Click the 'Add' button to jot down your thoughts, ideas, and memories. Let's get Started`}
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        isOpen={openAddEditModal.isShown}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      <Modal
        onRequestClose={() => setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))}
        isOpen={openViewModal.isShown}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={async () => {
            await deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
