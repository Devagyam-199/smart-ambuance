import { useState } from "react";
import React from 'react'
import { Eye, EyeOff } from "lucide-react"; // Import eye icons (optional)

const UserMainPage = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full">
            <input
                id="pass"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-3 w-full border-2 mt-2 rounded-lg font-poppins border-gray-400 focus:border-gray-600 outline-none"
                placeholder="Enter Your Password"
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-600"
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
  )
}

export default UserMainPage