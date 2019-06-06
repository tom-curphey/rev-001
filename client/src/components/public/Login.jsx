import React, { useState } from 'react';
import TextInput from '../layout/input/TextInput';

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

  return (
    <section className="login">
      <form>
        <TextInput
          value={email}
          name="email"
          onChange={e => onChange(e)}
        />
      </form>
    </section>
  );
};

export default Login;
