import React, { useState } from 'react';
import axios from 'axios';

async function addBlock(blockData) {
  try {
    // Remove all spaces from aadhar_number
    
    console.log('Sending blockData:', blockData);
    
    // Make the POST request
    const response = await axios.post(
      'https://sudarshan-blockchain-prod.vercel.app/api/blockchain/verify-data',
      blockData,
      {
        headers: {
          'X-API-KEY': process.env.API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Block added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding block:', error.message);
    return "Document is Invalid";
  }
}

async function callFastApi(documentFile) {
  const formData = new FormData();
  formData.append('file', documentFile);

  try {
    // Make the POST request to your FastAPI server running on localhost
    const response = await axios.post('http://127.0.0.1:8000/extract-details/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Handle the response
    console.log('Extracted details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calling the FastAPI:', error.response ? error.response.data : error.message);
    return null;
  }
}

const UploadDocument = () => {
  const [documentType, setDocumentType] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documentFile) {
      setMessage('Please select a file before submitting');
      return;
    }

    try {
      // Call the FastAPI to extract details from the document
      const extractedData = await callFastApi(documentFile);
      
      if (!extractedData) {
        setMessage('Error extracting data from the document');
        return;
      }

      setResult(extractedData);
      // console.log(extractedData['aadhaar_number']);
      extractedData.aadhaar_number = extractedData.aadhaar_number.replace(/\s+/g, '');
      const blockData = {
        document_content: {
          aadhar_number: extractedData.aadhaar_number
        }
      };

      // Add the block and get the response
      const apiResult = await addBlock(blockData);
      setApiResponse(apiResult);
    } catch (err) {
      console.error('Error processing document:', err);
      setMessage('Error processing document');
    }
  };

  return (
    <div className="relative bg-gray-50 min-h-screen py-12 px-6 overflow-hidden">
      <div className="relative z-10 max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg opacity-90">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Verify Document</h2>
        {message && (
          <p
            className={`mb-4 p-3 rounded-md text-center ${
              message.includes('Error')
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="documentType" className="block text-gray-700 text-sm font-semibold mb-2">
              Document Type
            </label>
            <select
              className="form-select block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              required
            >
              <option value="" disabled>Select Document Type</option>
              <option>Aadhar Card</option>
              <option>PAN Card</option>
              <option>Driving License</option>
            </select>
          </div>

          <div>
            <label htmlFor="documentFile" className="block text-gray-700 text-sm font-semibold mb-2">
              Upload File
            </label>
            <input
              type="file"
              className="block text-gray-700 text-sm font-semibold mb-2"
              id="documentFile"
              onChange={(e) => setDocumentFile(e.target.files[0])}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-md shadow-none hover:bg-blue-600 transition-transform transform-gpu">
            Submit
          </button>
        </form>

        {result && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Extracted Details</h3>
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Aadhaar Number:</strong> {result.aadhaar_number}</p>
            <p><strong>Date of Birth:</strong> {result.date_of_birth}</p>
            <p><strong>Gender:</strong> {result.gender}</p>
          </div>
        )}

        {apiResponse && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Block Data</h3>
            <pre className="bg-gray-100 p-4 rounded-md">{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDocument;
