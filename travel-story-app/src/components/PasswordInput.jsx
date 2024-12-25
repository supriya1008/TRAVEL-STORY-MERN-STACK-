import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setIsShowPassword((prevState) => !prevState);
    };

    return (
        <div className="flex items-center bg-cyan-600/10 px-5 py-3 rounded-md mb-3 border border-gray-300 focus-within:ring-2 focus-within:ring-cyan-500">
            <input
                type={isShowPassword ? "text" : "password"} // Toggle input type based on visibility
                value={value}
                onChange={onChange}
                placeholder={placeholder || "Password"}
                className="w-full text-sm bg-transparent py-2 outline-none placeholder-gray-500"
            />

            {/* Show the appropriate icon based on password visibility */}
            {isShowPassword ? (
                <FaRegEyeSlash
                    size={22}
                    className="text-primary cursor-pointer"
                    onClick={toggleShowPassword}
                />
            ) : (
                <FaRegEye
                    size={22}
                    className="text-slate-400 cursor-pointer"
                    onClick={toggleShowPassword}
                />
            )}
        </div>
    );
};

export default PasswordInput;
