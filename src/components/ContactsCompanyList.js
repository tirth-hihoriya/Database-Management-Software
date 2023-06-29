import React from 'react'

const ContactsCompanyList = ({ companynotInContacts, copyAllToClipboard }) => {
  return (
    <div className='mt-6'>
      <div className='flex items-center justify-between'>
        <h5 className='mb-3'>List of companies not in CONTACTS database ({companynotInContacts.length})</h5>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded'
          onClick={copyAllToClipboard}
        >
          Copy All
        </button>
      </div>

      <table className='w-full'>
        <thead>
          <tr>
            <th className='bg-gray-200 text-gray-600 px-4 py-2 font-semibold text-sm'>
              #
            </th>
            <th className='bg-gray-200 text-gray-600 px-4 py-2 font-semibold text-sm'>
              Company Name
            </th>
            <th className='bg-gray-200 text-gray-600 px-4 py-2 font-semibold text-sm'>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {companynotInContacts.map((name, index) => (
            <tr key={index}>
              <td className='border px-4 py-2'>{index + 1}</td>
              <td className='border px-4 py-2'>{name}</td>
              <td className='border px-4 py-2'>
                <button
                  className='bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded'
                  onClick={() => navigator.clipboard.writeText(name)}
                >
                  Copy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan='3' className='text-right'></td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default ContactsCompanyList
