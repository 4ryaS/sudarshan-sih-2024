import React from 'react';
import { motion } from 'framer-motion';

const Profile = () => {
  // Sample user data (replace with dynamic data as needed)
  const user = {
    name: 'Admin',
    email: 'xyz@example.com',
    profilePicture: 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg', // Replace with actual profile picture URL
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-none">
        <div className="flex justify-center mb-6">
          <motion.img
            src={user.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <h1 className="text-3xl font-semibold text-center mb-4">{user.name}</h1>
        <p className="text-center text-gray-600 mb-4">{user.email}</p>

        {/* Profile Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-none">
          <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
          <p className="mb-2"><span className="font-semibold">Name:</span> {user.name}</p>
          <p className="mb-2"><span className="font-semibold">Email:</span> {user.email}</p>
          {/* Add more user details as needed */}
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 text-center">
          <a href="#" className="text-blue-500 hover:underline">Edit Profile</a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
