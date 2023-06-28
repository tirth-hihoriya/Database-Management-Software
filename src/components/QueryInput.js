import React from 'react'

const QueryInput = ({
  handleTextChange,
  handleTextInput,
  query,
  handleSelectChange
}) => {
  return (
    <div className='mt-4'>
      <label htmlFor='searchBy' className='block mb-2'>
        Search by:
      </label>
      <div className='relative'>
        <select
          id='searchBy'
          className={`block border border-gray-300 rounded py-2 px-4 w-full mb-2 focus:outline-none focus:border-blue-500`}
          onChange={handleSelectChange}
        >
          <option value='' disabled>
            Search by
          </option>
          <option value='companyName'>Company Name</option>
          <option value='industry'>Industry</option>
          <option value='type'>Type category</option>
        </select>
        <label htmlFor='query' className='block mb-2'>
          Query:
        </label>
        <textarea
          className='block border border-gray-300 rounded py-2 px-4 w-full mb-2 h-32'
          placeholder='Enter query'
          onChange={handleTextChange}
          value={query}
        ></textarea>
      </div>
      <button
        className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'
        onClick={handleTextInput}
      >
        Submit
      </button>
    </div>
  )
}

export default QueryInput
