import React, { useState } from 'react';
import TextInput from '../layout/input/TextInput';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value
    });

  const handleOnSubmit = e => {
    e.preventDefault();

    const user = {
      email: email,
      password: password
    };

    console.log(user);
  };

  return (
    <section className="login">
      <form onSubmit={e => handleOnSubmit(e)}>
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
        <Link to="register">Signup</Link>
        <button>Login</button>
      </form>
    </section>
  );
};

export default Login;
