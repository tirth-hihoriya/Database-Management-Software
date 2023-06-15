import React, { useState } from 'react'
import axios from 'axios'

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [filteredData, setFilteredData] = useState([])
  const [downloadLink, setDownloadLink] = useState('')
  const [query, setQuery] = useState('')

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
        setDownloadLink(response.data.downloadLink)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const handleDownload = () => {
    if (downloadLink) {
      axios
        .get('http://localhost:5000' + downloadLink, { responseType: 'blob' })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'processed_data.xlsx')
          document.body.appendChild(link)
          link.click()
          link.parentNode.removeChild(link)
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }
  }

  const handleTextInput = () => {
    axios
      .get('http://localhost:5000/api/query', { params: { query } })
      .then(response => {
        setFilteredData(response.data.filteredData)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const handleTextChange = event => {
    setQuery(event.target.value)
  }

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <div className='card'>
            <div className='card-body'>
              <h3 className='card-title mb-4'>File Upload</h3>
              <div className='form-group'>
                <input
                  type='file'
                  className='form-control-file'
                  accept='.xlsx,.xls'
                  onChange={handleFileChange}
                />
              </div>
              <button
                className='btn btn-primary'
                onClick={handleUpload}
                disabled={!selectedFile}
              >
                Upload
              </button>

              <div className='mt-4'>
                <textarea
                  className='form-control'
                  placeholder='Enter query'
                  onChange={handleTextChange}
                ></textarea>
                <button
                  className='btn btn-primary mt-3'
                  onClick={handleTextInput}
                >
                  Submit
                </button>
              </div>

              {filteredData.length > 0 && (
                <div className='mt-4'>
                  <table className='table table-hover'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((row, index) => (
                        <tr key={index}>
                          <td>{row.Name}</td>
                          <td>{row.Age}</td>
                          <td>{row.Email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    className='btn btnsuccess btn-success'
                    onClick={handleDownload}
                  >
                    Download Processed Data
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUpload
