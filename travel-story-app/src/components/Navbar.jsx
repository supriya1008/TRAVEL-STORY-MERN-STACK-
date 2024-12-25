import React from "react";
import LOGO from "../assets/images/logo1.png";
import ProfileInfo from "./cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "./Input/SearchBar";

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNote }) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const onClearSearch = () => {
    setSearchQuery("");
    onSearchNote(""); // Optional: clear the search results on clear
  };

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={LOGO} alt="Travel Story" className="h-9" />
      {isToken && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={() => onSearchNote(searchQuery)} // Directly use `onSearchNote`
            onClearSearch={onClearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </>
      )}
    </div>
  );
};


export default Navbar;
