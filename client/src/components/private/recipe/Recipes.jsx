import React from 'react';
import { Link } from 'react-router-dom';

const Recipes = () => {
  return (
    <div>
      Recipes
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  );
};

export default Recipes;
