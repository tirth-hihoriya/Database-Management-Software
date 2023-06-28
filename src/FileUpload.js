import React, { useState } from 'react'
import axios from 'axios'
import FileInput from './components/FileInput'
import QueryInput from './components/QueryInput'
import DataDisplay from './components/DataDisplay'
import ContactsDisplay from './components/ContactsDisplay'
import CompanyList from './components/CompanyList'
import ContactsCompanyList from './components/ContactsCompanyList'

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [filteredData, setFilteredData] = useState([])
  const [filteredConstactsData, setFilteredConstactsData] = useState([])
  const [companynotIncluded, setCompanynotIncluded] = useState([])
  const [companynotInContacts, setCompanynotInContacts] = useState([])
  const [downloadLink, setDownloadLink] = useState('')
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')


  const handleFileChange = event => {
    setSelectedFile(event.target.files[0])
  }

  const handleUpload = () => {
    const formData = new FormData()
    formData.append('file', selectedFile)

    axios
      .post('http://localhost:5000/api/preprocess', formData)
      .then(response => {
        setFilteredData(response.data.filteredData)
        setFilteredConstactsData(response.data.filteredContactsData)
        setDownloadLink(response.data.downloadLink)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const handleCompanyDownload = () => {
    if (downloadLink) {
      axios
        .get('http://localhost:5000' + downloadLink+ '/company', { responseType: 'blob' })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'filtered_company_data.csv')
          document.body.appendChild(link)
          link.click()
          link.parentNode.removeChild(link)
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }
  }

  const handleContactsDownload = () => {
    if (downloadLink) {
      axios
        .get('http://localhost:5000' + downloadLink+ '/contacts', { responseType: 'blob' })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'filtered_contacts_data.csv')
          document.body.appendChild(link)
          link.click()
          link.parentNode.removeChild(link)
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }
  }

  const copyAllToClipboard = () => {
    const allCompanyNames = companynotIncluded.join('\n')
    navigator.clipboard
      .writeText(allCompanyNames)
      .then(() => {
        console.log('All company names copied to clipboard')
      })
      .catch(error => {
        console.error('Error copying all company names to clipboard:', error)
      })
  }

  const handleTextAreaPlaceholder = () => {
    switch (selectedCategory) {
      case 'companyName':
        return 'Enter list of company names';
      case 'industry':
        return 'Enter industry name (e.g. Fin Tech, Real Estate, Health, Blockchain/Crypto, etc.)';
      case 'type':
        return 'Enter company type (e.g. Venture Capital, Multi Family Office, Corporation, etc.)';
      default:
        return '';
    }
  };
  


  const handleTextInput = () => {
    axios
      .get('http://localhost:5000/api/query', { params: { query, selectedCategory } })
      .then(response => {
        setFilteredData(response.data.filteredData)
        setFilteredConstactsData(response.data.filteredContactsData)
        setCompanynotIncluded(response.data.companyNotIncluded)
        setCompanynotInContacts(
          response.data.companyNotIncludedInContacts
        )
        setDownloadLink('/api/download')
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const handleTextChange = event => {
    setQuery(event.target.value)
  }
  const handleSelectChange = event => {
    setSelectedCategory(event.target.value)
  }

  return (
    <div className='flex items justify-center min-h-screen bg-gray-100'>
      <div className='max-w-3xl w-full m-4 p-6 bg-white shadow-lg rounded-lg'>
        <h3 className='text-2xl font-semibold mb-4'>File Upload</h3>
        <FileInput
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          selectedFile={selectedFile}
        />

        <QueryInput
          handleTextChange={handleTextChange}
          handleTextInput={handleTextInput}
          query={query}
          handleTextAreaPlaceholder = {handleTextAreaPlaceholder}
          handleSelectChange={handleSelectChange}

        />

        {filteredData && filteredData.length > 0 ? (
          <DataDisplay
            filteredData={filteredData}
            handleCompanyDownload={handleCompanyDownload}
          />
        ) : (
          <p className='mt-4'>No data available</p>
        )}

        {filteredConstactsData && filteredConstactsData.length > 0 ? (
          <ContactsDisplay
            filteredConstactsData={filteredConstactsData}
            handleContactsDownload={handleContactsDownload}
          />
        ) : (
          <p className='mt-4'>No data available</p>
        )}
      </div>
      <div className='max-w-2xl m-4 w-full p-6 bg-white shadow-lg rounded-lg'>
        {companynotIncluded && companynotIncluded.length > 0 ? (
          <CompanyList
            companynotIncluded={companynotIncluded}
            copyAllToClipboard={copyAllToClipboard}
          />
        ) : (
          <p className='mt-4'>All included</p>
        )}

        {companynotInContacts &&
        companynotInContacts.length > 0 ? (
          <ContactsCompanyList
            companynotInContacts={companynotInContacts}
            copyAllToClipboard={copyAllToClipboard}
          />
        ) : (
          <p className='mt-4'>All included</p>
        )}
      </div>
    </div>
  )
}

export default FileUpload
