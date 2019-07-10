import React from 'react';
import { withRouter } from 'react-router-dom';

const NewComponent = ({ match }) => {
  console.log('p', match);

  let title = '';
  let intro = '';
  let feature = '';

  switch (match.url) {
    case '/account/notifications':
      title = 'Notifications Section';
      intro = 'Curious about your email notifications?';
      feature =
        "Right now you won't be emailed unless you contact us directly, these feature is where you will be able to control email notifications in the future. Just like you we hate spam emails & will be very respectful when emailing you about any new features. If you never want emails from us please let us know.";
      break;
    default:
      title = 'Coming soon..';
      intro = 'Thanks so much for stopping by..';
  }

  return (
    <section className="newFeature">
      <div className="centerBox">
        <h1>{title}</h1>
        <h3>New Feature</h3>
        <div>
          <p>{intro}</p>

          <p>{feature}</p>

          <p>
            Currently we are building out this section of Recipe
            Revenue. Click the link below if you would like to be
            apart of the test phase of this feature.
          </p>

          <p>
            If you have any recommnedations as to what you would like
            us to include in this feature please let us know below.
          </p>

          <p>
            Chat soon,
            <br />
            Tom Curphey
          </p>
        </div>
      </div>
    </section>
  );
};

export default withRouter(NewComponent);
