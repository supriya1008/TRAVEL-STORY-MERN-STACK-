import React, { useState } from "react"; // Import useState
import { MdAdd, MdClose } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue(""); // Clear input field after adding tag
    }
  };
  const handleRemoveTag=(tagToRemove)=>{
    setTags(tags.filter((tag)=>tag!==tagToRemove));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  return (
    <div>
      <div>
  {tags.length > 0 && (
    <div className="flex items-center gap-2 flex-wrap mt-2">
      {tags.map((tag, index) => (
        <span key={index} className="flex items-center gap-2 text-sm text-cyan-6-- bg-cyan-200/40 px-3 py-1 rounded">
          <GrMapLocation className="text-sm" /> {tag}
          <button onClick={() => handleRemoveTag(tag)}>
            <MdClose />
          </button>
        </span>
      ))}
    </div>
  )}
</div>

      <div className="flex items-center gap-4 mt-3">
        {/* Map Location Icon */}
        <GrMapLocation className="text-xl text-gray-500" />
        <input
          type="text"
          value={inputValue}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add Location"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {/* Add Icon */}
        <MdAdd
          className="cursor-pointer text-lg text-blue-500"
          onClick={addNewTag}
        />
        {/* Close Icon */}
        {inputValue && (
          <MdClose
            className="cursor-pointer text-lg text-red-500"
            onClick={() => setInputValue("")}
          />
        )}
      </div>
    </div>
  );
};

export default TagInput;
