import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, 
          DialogContentText, DialogTitle, Button,
          IconButton, TextField, FormControl,
          TextareaAutosize } from "@material-ui/core";
import axios from 'axios';



const ContactsDisplay = ({ filteredConstactsData, handleContactsDownload }) => {
  const columnOrder = ['First Name', 'Last Name', 'Email', 'Company Name']
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState({
    f_name: "",
    l_name: "",
    email: "",
    sub: "",
    body: ""
  });

  const handleClick = (i) => {
    console.log(filteredConstactsData[i]);
    console.log("Open window");
    setOpen(!open);
    setRecord({ f_name: filteredConstactsData[i]["First Name"],
                l_name: filteredConstactsData[i]["Last Name"],        
                email: filteredConstactsData[i].Email})
    console.log(record);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log(record);
    setOpen(false);
    // let mail = {
    //   name: record.f_name+" "+record.l_name,
    //   sub: record.sub,
    //   body: record.body,
    //   email: record.email
    // };
    
    axios.post('http://localhost:5000/api/sendEmail', record)
        .then(response => console.log(response));
  };

  const handleChange = (e) => {
    const {name, value} = e.target;

    setRecord((values) => ({
      ...values,
      [name]: value
    }))
    console.log(record);
  };

  return (
    <div className='relative'>
      <div className='relative'>
        <h3 className='text-2xl font-bold mt-5 text-darkgreen-600 py-2'>
          Filtered Contacts data ({filteredConstactsData.length})
        </h3>

        <button
          className='absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-all duration-300'
          onClick={handleContactsDownload}
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
              <th className='text-gray-600 px-4 py-2 font-semibold text-sm'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredConstactsData.map((row, index) => (
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
                <td className='border px-4 py-2'>
                  <IconButton onClick={() => handleClick(index)}>
                    <i className="material-icons">email</i>
                  </IconButton>
                </td>  
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Send Email To {record.f_name} {record.l_name}. </DialogTitle>
            <DialogContent>
              <DialogContentText>
                
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                value={record.email}
              />
              <TextField
                autoFocus
                margin="dense"
                name="sub"
                label="Subject"
                type="text"
                fullWidth
                variant="standard"
                value={record.sub}
                onChange = {(e) => handleChange(e)}
              />
              <TextareaAutosize
                minRows={12}
                name="body"
                aria-label="maximum height"
                style={{ width: "100%" }}
                placeholder="Maximum 4 rows"
                onChange = {(e) => handleChange(e)}
                defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua."
                value={record.body}
              />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" style={{ backgroundColor: "red" }} onClick={handleClose}>Cancel</Button>
              <Button variant="contained" style={{ backgroundColor: "green" }} onClick={handleSubmit}>Send</Button>
            </DialogActions>
          </Dialog>
          
        
      </div>
    </div>
  )
}

export default ContactsDisplay
