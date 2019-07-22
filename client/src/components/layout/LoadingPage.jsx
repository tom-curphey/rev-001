import React from 'react';
import Spinner from './Spinner';
import loadingSvg from '../../images/loading.svg';

const LoadingPage = () => {
  return (
    <section className="loadingPage">
      <div>
        <img
          src={loadingSvg}
          alt="We are just setting up your profile"
        />
      </div>
      <div className="loadingText">
        <div className="loadingTextLayout">
          <h1>Setting up your profile</h1>
          <Spinner />
        </div>
      </div>
    </section>
  );
};

export default LoadingPage;
