import React from 'react';

const QueryInput = ({ handleTextChange, handleTextInput, query }) => {
  return (
    <div className="mt-4">
      <textarea
        className="block border border-gray-300 rounded py-2 px-4 w-full mb-2"
        placeholder="Enter query"
        onChange={handleTextChange}
        value={query}
      ></textarea>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        onClick={handleTextInput}
      >
        Submit
      </button>
    </div>
  );
};

export default QueryInput;
