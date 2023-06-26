import React from 'react';
import FileUpload from './FileUpload';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <h1 className="mb-4 text-3xl text-center font-extrabold text-gray-900 dark:text-blue-400 md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-600">
          Edge196
        </span>
        {' '}
        Database
      </h1>
      <FileUpload />
    </div>
  );
}

export default App;
