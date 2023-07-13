import React from 'react'

const QueryInput = ({
  handleTextChange,
  handleTextInput,
  query,
  handleSelectChange,
  handleTextAreaPlaceholder
}) => {
  return (
    <div className='mt-4'>
      <label htmlFor='searchBy' className='block mb-2'>
      <h3 className='text-xl font-semibold '>Search by:</h3>
      </label>
      <div className='relative'>
        <select
          id='searchBy'
          className={`block border border-gray-300 rounded py-2 px-4 w-full mb-2 focus:outline-none focus:border-blue-500`}
          onChange={handleSelectChange}
        >
          <option value='' className='text-gray-400'>
            {' '}
            select dropdown{' '}
          </option>
          <option value='companyName'>Company Name</option>
          <option value='url'>Company URL/Link</option>
          <option value='industry'>Company Industry</option>
          <option value='type'>Investor Type</option>
        </select>
        <label htmlFor='query' className='block mb-2'>
        <h3 className='text-xl font-semibold'>Query:</h3>
        </label>
        <textarea
          className='block border border-gray-300 rounded py-2 px-4 w-full mb-2 h-32'
          placeholder={handleTextAreaPlaceholder()}
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
