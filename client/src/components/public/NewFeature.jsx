import React from 'react';
import AuthMenu from '../layout/menu/AuthMenu';
import { withRouter } from 'react-router-dom';

const NewFeature = ({ match }) => {
  console.log('p', match);

  let title = '';
  let intro = '';
  let feature = '';

  switch (match.url) {
    case '/packaging':
      title = 'Packaging Section';
      intro = 'Curious about the new Packaging Feature?';
      feature =
        'This feature will help you compare & find packaging suppliers based on our location & packaging requirements such as branding, cleanliness & temperature';
      break;
    case '/menu-items':
      title = 'Menu Items Section';
      intro = 'Curious about the new Menu Items Feature?';
      feature =
        'A menu item sometimes has multiple recipes that are brought together to complete the dish. The menu items section will enable you to combine any recipe you have created so you can understand the overall profitability and costs of each menu item.';
      break;
    case '/integrations':
      title = 'Account Integrations';
      intro =
        'Curious about how your account can integrate with other services?';
      feature =
        "Great question! Right now we don't integrate with any third party services, however we are just as excited as you are to start implementing this functionality. If there is a service you would like us to integrate with, let us know below";
      break;
    case '/performance':
      title = 'Venue Performance';
      intro =
        'How is your venue performing? How much profit such it be generating?';
      feature =
        "Every venue should be looked at as a tool for generating profit. This feature will give you a clear understanding of your venue's operating costs so you can make an informed decisions when improving your venues return on investment";
      break;
    default:
      title = 'Coming soon..';
      intro = 'Thanks so much for stopping by..';
  }

  return (
    <AuthMenu>
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
              If you have any recommnedations as to what you would
              like us to include in this feature please let us know
              below.
            </p>

            <p>
              Chat soon,
              <br />
              Tom Curphey
            </p>
          </div>
        </div>
      </section>
    </AuthMenu>
  );
};

export default withRouter(NewFeature);
