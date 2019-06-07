import React, { useState } from 'react';
import TextInput from '../layout/input/TextInput';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: ''
  });

  const { firstName, email, password } = formData;

  const onChange = e =>
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value
    });

  const handleOnSubmit = async e => {
    e.preventDefault();

    const newUser = {
      firstName: firstName,
      email: email,
      password: password
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const body = JSON.stringify(newUser);
      const res = await axios.post('/api/user', body, config);

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="register">
      <form onSubmit={e => handleOnSubmit(e)}>
        <TextInput
          placeholder="First Name"
          value={firstName}
          name="firstName"
          onChange={e => onChange(e)}
        />
        <TextInput
          placeholder="Email"
          value={email}
          name="email"
          onChange={e => onChange(e)}
        />
        <TextInput
          placeholder="Password"
          value={password}
          name="password"
          onChange={e => onChange(e)}
          type="password"
        />
        <button>Get Started</button>
      </form>
    </section>
  );
};

export default Register;
