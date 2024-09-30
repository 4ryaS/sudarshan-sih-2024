// // src/pages/MyDocuments.js

// import React from 'react';

// const MyDocuments = () => {
//   // Sample Data (Replace with dynamic data as needed)
//   const documents = [
//     {
//       id: 1,
//       title: 'Birth Certificate',
//       type: 'Birth Certificate',
//       status: 'Verified',
//     },
//     {
//       id: 2,
//       title: 'Academic Transcript',
//       type: 'Academic Transcript',
//       status: 'Pending',
//     },
//     // Add more documents as needed
//   ];

//   // Function to get status color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Verified':
//         return 'text-success';
//       case 'Pending':
//         return 'text-warning';
//       case 'Rejected':
//         return 'text-danger';
//       default:
//         return 'text-secondary';
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2><i className="fas fa-folder"></i> My Documents</h2>
//       <div className="row">
//         {documents.map((doc) => (
//           <div className="col-md-4" key={doc.id}>
//             <div className="card mb-4 shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title"><i className="fas fa-file-alt"></i> {doc.title}</h5>
//                 <p className="card-text"><i className="fas fa-id-card"></i> Type: {doc.type}</p>
//                 <p className={`card-text ${getStatusColor(doc.status)}`}>
//                   <i className="fas fa-check-circle"></i> Status: {doc.status}
//                 </p>
//                 <a href="#" className="btn btn-primary">
//                   <i className="fas fa-eye"></i> View Document
//                 </a>
//               </div>
//             </div>
//           </div>
//         ))}
//         {/* Add more cards dynamically */}
//       </div>
//     </div>
//   );
// };

// export default MyDocuments;

// src/pages/MyDocuments.js

// src/pages/MyDocuments.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch documents from the backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Update this line to call the correct backend URL
        const response = await axios.get('http://localhost:3001/api/documents');
        setDocuments(response.data); // Set documents data
        setLoading(false);
      } catch (err) {
        setError(`Error fetching documents: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'text-success';
      case 'Pending':
        return 'text-warning';
      case 'Rejected':
        return 'text-danger';
      default:
        return 'text-secondary';
    }
  };

  if (loading) {
    return <div className="container mt-5">Loading documents...</div>;
  }

  if (error) {
    console.error(error);  // Log the error for debugging purposes
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2><i className="fas fa-folder"></i> My Documents</h2>
      <div className="row">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div className="col-md-4" key={doc._id}>
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title"><i className="fas fa-file-alt"></i> {doc.originalName}</h5>
                  <p className="card-text"><i className="fas fa-id-card"></i> Type: {doc.documentType || 'N/A'}</p>
                  <p className={`card-text ${getStatusColor(doc.verificationResult)}`}>
                    <i className="fas fa-check-circle"></i> Status: {doc.verificationResult || 'Pending'}
                  </p>
                  <a href={doc.path} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <i className="fas fa-eye"></i> View Document
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No documents found.</p>
        )}
      </div>
    </div>
  );
};

export default MyDocuments;

