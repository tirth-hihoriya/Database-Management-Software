import React from 'react';

const FileInput = ({ handleFileChange, handleUpload, selectedFile }) => {
  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="block border border-gray-300 rounded py-2 px-4 w-full mb-4"
      />

      <button
        className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${
          !selectedFile ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        Upload
      </button>
    </div>
  );
};

export default FileInput;
