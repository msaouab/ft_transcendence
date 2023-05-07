import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cookies, useCookies } from 'react-cookie';


function Avatar() {
  const cookie = new Cookies();
  const [cookies] = useCookies(['id']);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      console.log('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    //id




    axios.post('http://localhost:3000/api/v1/user/' +  cookie.get('userid') + '/file', formData, { withCredentials: true }
    )
      .then(response => {
        console.log('File uploaded successfully');
      })
      .catch(error => {
        console.log('Error uploading file:', error);
      });

    }

    console.log(cookies.id);


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Upload file:
        <input type="file" onChange={handleFileChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}


export default Avatar;