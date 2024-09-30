const axios = require('axios');

// Define the data you want to send in the POST request
const blockData = {
  // Include the data fields required by your API
  document_content: "data1"
  // Add more fields as needed
};

// Function to add a block
async function addBlock() {
  try {
    // Make the POST request
    const response = await axios.post('http://192.168.247.170:3000/api/blockchain/add-block', blockData);

    // Handle the response
    console.log('Block added successfully:', response.data);
  } catch (error) {
    // Handle any errors
    console.error('Error adding block:', error.message);
  }
}

// Call the function to add a block
addBlock();