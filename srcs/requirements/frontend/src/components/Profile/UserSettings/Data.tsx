import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';


    
    interface FormData {
      login: string;
      firstName: string;
      lastName: string;
    }
    
    function Form() {
      const [formData, setFormData] = useState<FormData>({
        login: '',
        firstName: '',
        lastName: ''
      });
    
      const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value
        });
      };
      const [user, printData] = useState({
		login: '',
		firstName: '',
		lastName: '',
	});
    useEffect(() => {
        const apiUrl = 'http://localhost:3000/api/v1/me'
		async function fetchData() {
            try {
                await axios.get(apiUrl, {
        	 withCredentials: true,
        	})
			.then(response => {
				if (response.statusText) {
					printData(response.data);
				}
			})
			.catch(error => {
                if (error.response.status == 401) { }
			})
		} catch (error) {
            console.log(error);
		}
	}  fetchData();
    }, []);

      const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const defaultFormData: FormData = Object.entries(formData).reduce((obj, [key, value]) => {
          if (!value) {
            obj[key as keyof FormData] = user[key as keyof FormData];
          } else {
            obj[key as keyof FormData] = value;
          }
          return obj;
        }, {} as FormData);
    
      
    axios.put('http://localhost:3000/api/v1/user/' + Cookies.get('userid') + '/update', defaultFormData, { withCredentials: true })
        .catch(error => console.error(error));
    
    };


  return (
    <form onSubmit={handleSubmit} className='text-black'>
      <label>
        Login:
        <input type="text" name="login" value={formData.login} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        First name:
        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Last name:
        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
      </label>
      <br />
      <button type="submit" className='bg-mygray' >Submit</button>
    </form>
  );
}

export default Form;