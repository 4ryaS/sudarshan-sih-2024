import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

async function addBlock(blockData) {
  try {
    const response = await axios.post('http://192.168.247.170:3000/api/blockchain/add-block', blockData);
    console.log('Block added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding block:', error.message);
    return null;
  }
}

const Generate = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    aadhar: '',
    photo: null
  });
  const [errors, setErrors] = useState({});
  const [showVoterID, setShowVoterID] = useState(false); // Control visibility of canvas and button
  const canvasRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (formData.aadhar) {
      const aadharNumber = formData.aadhar.replace(/\s+/g, '');
      if (aadharNumber.length < 12) {
        newErrors.aadhar = 'Aadhar number must be exactly 12 digits.';
        valid = false;
      } else if (!/^\d{12}$/.test(aadharNumber)) {
        newErrors.aadhar = 'Aadhar number must be numeric.';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const generateVoterID = (aadhaar_no) => {
    let hash = 0;
    for (let i = 0; i < aadhaar_no.length; i++) {
      hash = (hash << 5) - hash + aadhaar_no.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString().padStart(8, '0');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const voterID = generateVoterID(formData.aadhar);

    // Add block to blockchain
    const blockData = {
      document_content: voterID
    };

    await addBlock(blockData);

    // Show the canvas and download button after submission
    setShowVoterID(true);

    // Ensure the canvas is ready before drawing
    setTimeout(() => {
      if (canvasRef.current) {
        drawVoterIDCard(formData.name, formData.dob, formData.gender, voterID, formData.photo);
      }
    }, 100); // Slight delay to ensure canvas is rendered
  };

  const drawVoterIDCard = (name, dob, gender, voterID, photo) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cornerRadius = 15;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.lineTo(canvas.width - cornerRadius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, cornerRadius);
    ctx.lineTo(canvas.width, canvas.height - cornerRadius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - cornerRadius, canvas.height);
    ctx.lineTo(cornerRadius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - cornerRadius);
    ctx.lineTo(0, cornerRadius);
    ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#090909';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (photo) {
      const img = new Image();
      img.onload = () => {
        const photoWidth = canvas.width * 0.35;
        const photoHeight = canvas.height * 0.7;
        ctx.drawImage(img, 20, 50, photoWidth, photoHeight);
        drawText(name, dob, gender, voterID, photoWidth);
      };
      img.src = URL.createObjectURL(photo);
    } else {
      drawText(name, dob, gender, voterID, 0);
    }

    function drawText(name, dob, gender, voterID, photoWidth) {
      const textX = photoWidth + 40;
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 22px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Voter ID Card', canvas.width / 2, 40);

      ctx.font = '18px Arial';
      ctx.textAlign = 'left';
      const lineHeight = 35;
      const startY = 80;

      ctx.fillText(`Name: ${name}`, textX, startY);
      ctx.fillText(`DOB: ${dob}`, textX, startY + lineHeight);
      ctx.fillText(`Gender: ${gender}`, textX, startY + 2 * lineHeight);
      ctx.fillText(`Voter ID: ${voterID}`, textX, startY + 3 * lineHeight);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'voter_id.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Get the current date to limit the max date to year 2006 for 18+ rule
  const maxDate = new Date(2006, 11, 31).toISOString().split('T')[0];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Generate Document
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="block w-full mt-1 border-0 border-b-2 border-gray-300 bg-transparent text-gray-500 focus:ring-0 focus:border-blue-500 placeholder-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="dob" className="block text-gray-700 text-sm font-semibold mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              max={maxDate} // Limit date to before 2007
              placeholder="Date of Birth"
              className="block w-full mt-1 border-0 border-b-2 border-gray-300 bg-transparent text-gray-500 focus:ring-0 focus:border-blue-500 placeholder-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-gray-700 text-sm font-semibold mb-2">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="block w-full mt-1 border-0 border-b-2 border-gray-300 bg-transparent text-gray-500 focus:ring-0 focus:border-blue-500 placeholder-opacity-50"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="aadhar" className="block text-gray-700 text-sm font-semibold mb-2">
              Aadhar Number
            </label>
            <input
              type="text"
              id="aadhar"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              placeholder="Enter your Aadhar number"
              className={`block w-full mt-1 border-0 border-b-2 border-gray-300 bg-transparent text-gray-500 focus:ring-0 focus:border-blue-500 placeholder-opacity-50 ${errors.aadhar ? 'border-red-500' : ''}`}
              maxLength="12"
              required
            />
            {errors.aadhar && <p className="text-red-600 text-sm mt-1">{errors.aadhar}</p>}
          </div>

          <div>
            <label htmlFor="photo" className="block text-gray-700 text-sm font-semibold mb-2">
              Upload Photo
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="block text-gray-700 text-sm font-semibold mb-2"
            />
          </div>

          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md shadow-lg hover:bg-blue-600 transition-transform transform-gpu"
            whileHover={{ scale: 1.05 }}
          >
            Generate
          </motion.button>
        </form>

        {/* Show canvas and download button only if form is submitted */}
        {showVoterID && (
          <>
            <canvas ref={canvasRef} width="400" height="250" className="mt-6"></canvas>
            <button onClick={downloadImage} className="mt-4 w-full bg-green-500 text-white py-3 rounded-md shadow-lg hover:bg-green-600 transition-transform transform-gpu">
              Download Voter ID
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Generate;
