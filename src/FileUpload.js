import React, { useState } from 'react';
import axios from 'axios';
import FileInput from './components/FileInput';
import QueryInput from './components/QueryInput';
import DataDisplay from './components/DataDisplay';
import CompanyList from './components/CompanyList';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [companynotIncluded, setcompanynotIncluded] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');
  const [query, setQuery] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    axios
      .post('http://localhost:5000/api/preprocess', formData)
      .then((response) => {
        setFilteredData(response.data.filteredData);
        console.log('=-=-=-=-=-=-=-=');
        console.log(filteredData);
        setDownloadLink(response.data.downloadLink);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleDownload = () => {
    if (downloadLink) {
      axios
        .get('http://localhost:5000' + downloadLink, { responseType: 'blob' })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'filtered_data.csv');
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const copyAllToClipboard = () => {
    const allCompanyNames = companynotIncluded.join('\n');
    navigator.clipboard
      .writeText(allCompanyNames)
      .then(() => {
        console.log('All company names copied to clipboard');
      })
      .catch((error) => {
        console.error('Error copying all company names to clipboard:', error);
      });
  };

  const handleTextInput = () => {
    axios
      .get('http://localhost:5000/api/query', { params: { query } })
      .then((response) => {
        setFilteredData(response.data.filteredData);
        setcompanynotIncluded(response.data.companyNotIncluded);
        setDownloadLink('/api/download');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleTextChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="flex items justify-center min-h-screen bg-gray-100">
      <div className="max-w-3xl w-full m-4 p-6 bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">File Upload</h3>
        <FileInput
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          selectedFile={selectedFile}
        />

        <QueryInput
          handleTextChange={handleTextChange}
          handleTextInput={handleTextInput}
          query={query}
        />

        {filteredData && filteredData.length > 0 ? (
          <DataDisplay
            filteredData={filteredData}
            handleDownload={handleDownload}
          />
        ) : (
          <p className="mt-4">No data available</p>
        )}

        
      </div>
      <div  className = "max-w-2xl m-4 w-full p-6 bg-white shadow-lg rounded-lg">
      {companynotIncluded && filteredData.length > 0 ? (
        <CompanyList
          companynotIncluded={companynotIncluded}
          copyAllToClipboard={copyAllToClipboard}
        />
      ) : (
        <p className="mt-4">All included</p>
      )}
      </div>
    </div>
  );
};

export default FileUpload;
