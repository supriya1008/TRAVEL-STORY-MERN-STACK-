import axiosInstance from "./axiosInstance"; // Corrected import statement

const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.post("/image-upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set header for file upload
      },
    });

    return response.data; // Return response data
  } catch (error) {
    console.error('Error uploading the image:', error);
    throw error; // Rethrow error for handling
  }
};

export default uploadImage;