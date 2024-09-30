import React from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaCheckCircle, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const Home = () => {
  const containerStyle = {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  };

  return (
    <div className="bg-gray-100 min-h-screen" style={containerStyle}>
      {/* Swiper Image Slider */}
      <section className="my-0">
        <div className="w-full">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            centeredSlides={false}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            className="mySwiper full-width-swiper"
          >
            {/* Welcome Text Slide */}
            <SwiperSlide>
              <div className="flex flex-col items-center justify-center h-72 bg-gradient-to-r from-blue-500 to-green-500 text-white">
                <motion.h1
                  className="text-6xl font-bold"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Welcome to Document Verification System
                </motion.h1>
                <p className="mt-4 text-lg">
                  Upload and verify your documents with ease!
                </p>
                <Link to="/generate" style={{ textDecoration: 'none' }}>
                  <motion.button
                    className="mt-6 bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    whileHover={{ scale: 1.1 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            </SwiperSlide>

            {/* Image Slide 1 */}
            <SwiperSlide>
              <img
                src="https://images.unsplash.com/photo-1707157281599-d155d1da5b4c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9mZmljaWFsJTIwZG9jdW1lbnRzfGVufDB8fDB8fHww"
                alt="Document Image 1"
                className="w-full h-72 object-cover"
              />
            </SwiperSlide>

            {/* Image Slide 2 */}
            <SwiperSlide>
              <img
                src="https://images.unsplash.com/photo-1454496406107-dc34337da8d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b2ZmaWNpYWwlMjBkb2N1bWVudHN8ZW58MHx8MHx8fDA%3D"
                alt="Document Image 2"
                className="w-full h-72 object-cover"
              />
            </SwiperSlide>

            {/* Image Slide 3 */}
            <SwiperSlide>
              <img
                src="https://images.unsplash.com/photo-1659353684749-94297eedd492?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fG9mZmljaWFsJTIwZG9mZmljaWFsJTIwZG9jdW1lbnRzfGVufDB8fDB8fHww"
                alt="Document Image 3"
                className="w-full h-72 object-cover"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto text-left px-4">
          <h2 className="text-3xl font-semibold mb-8">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            
            {/* Feature 1: Document Generation */}
            <Link to="/generate" style={{ textDecoration: 'none' }}>
              <motion.div
                className="bg-white p-6 rounded border-t-4 cursor-pointer"
                style={{
                  borderTop: '4px solid',
                  borderImage: 'linear-gradient(119.54deg, #1cb5e0 0%, #000046 100%) 1',
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center">
                  <FaUpload className="text-blue-500 text-2xl mr-4 pb-2" />
                  <h3 className="text-xl font-semibold">Document Generation</h3>
                </div>
                <p className="text-gray-600 mt-2 pl-10">
                  Generate your documents seamlessly with our user-friendly interface.
                </p>
              </motion.div>
            </Link>

            {/* Feature 2: Fast Verification */}
            <Link to="/upload" style={{ textDecoration: 'none' }}>
              <motion.div
                className="bg-white p-6 rounded border-t-4 cursor-pointer"
                style={{
                  borderTop: '4px solid',
                  borderImage: 'linear-gradient(119.54deg, #1cb5e0 0%, #000046 100%) 1',
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 text-2xl pb-2 mr-4" />
                  <h3 className="text-xl font-semibold">Fast Verification</h3>
                </div>
                <p className="text-gray-600 mt-2 pl-10">
                  Get your documents verified quickly using machine learning and blockchain security.
                </p>
              </motion.div>
            </Link>

            {/* Feature 3: Secure Access */}
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <motion.div
                className="bg-white p-6 rounded border-t-4 cursor-pointer"
                style={{
                  borderTop: '4px solid',
                  borderImage: 'linear-gradient(119.54deg, #1cb5e0 0%, #000046 100%) 1',
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center">
                  <FaLock className="text-red-500 text-2xl pb-2 mr-4" />
                  <h3 className="text-xl font-semibold">Secure Access</h3>
                </div>
                <p className="text-gray-600 mt-2 pl-10">
                  Your documents are stored securely for every profile.
                </p>
              </motion.div>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
