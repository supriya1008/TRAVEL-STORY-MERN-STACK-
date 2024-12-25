import React, { useRef } from "react";
import { FaRegFileImage, FaTrashAlt } from "react-icons/fa"; // Import Trash Icon

const ImageSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file); // Pass the selected image to the parent component
      };
      reader.readAsDataURL(file); // Convert image to base64 URL
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const deleteImage = () => {
    setImage(null); // Clear the image state in the parent component
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input file value
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">TITLE</h2>
      <p className="text-sm text-gray-500 mb-4">A Day at the Great Wall</p>

      {!image ? (
        <>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
            onClick={onChooseFile}
          >
            <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
              <FaRegFileImage className="text-xl text-cyan-500" />
            </div>
            <p className="text-sm text-slate-500">Browse image files to upload</p>
          </button>
        </>
      ) : (
        <div className="relative">
          <img
            src={URL.createObjectURL(image)} // Display the selected image
            alt="Selected"
            className="w-full rounded-lg border border-gray-200"
          />
          <button
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"
            onClick={deleteImage}
          >
            <FaTrashAlt className="text-sm" />
          </button>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 mb-1">STORY</h3>
        <p className="text-gray-500">Your Story</p>
      </div>
    </div>
  );
};

export default ImageSelector;
