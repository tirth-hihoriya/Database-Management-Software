import React from 'react'

const DataDisplay = ({ filteredData, handleDownload }) => {
  const columnOrder = ['Company name', 'City', 'Company Domain Name']

  return (
    <div className='relative'>
      <div className='relative'>
        <h3 className='text-2xl font-bold mt-5 text-darkgreen-600 py-2'>
          Filtered data
        </h3>

        <button
          className='absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-all duration-300'
          onClick={handleDownload}
        >
          Export
        </button>
      </div>

      <div className='mt-10 overflow-x-auto overflow-y-auto max-h-80'>
        <table className='table-auto'>
          <thead className='sticky top-0 bg-gray-200'>
            <tr>
              <th className='text-gray-600 px-4 py-2 font-semibold text-sm'>
                Index
              </th>
              {columnOrder.map(columnName => (
                <th
                  key={columnName}
                  className='text-gray-600 px-4 py-2 font-semibold text-sm'
                >
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className='h-2'>
                <td className='border px-4 py-2'>{index + 1}</td>
                {columnOrder.map(columnName => (
                  <td
                    key={columnName}
                    className={`border px-4 py-2 ${
                      row[columnName] === 'Empty' ? 'text-gray-400' : ''
                    }`}
                  >
                    {row[columnName]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataDisplay
