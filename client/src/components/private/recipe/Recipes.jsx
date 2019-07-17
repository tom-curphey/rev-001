// import React from 'react';
// import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import AuthMenu from '../../layout/menu/AuthMenu';
// import Spinner from '../../layout/Spinner';

// const Recipes = ({ profile, isAuthenticated, recipe }) => {
//   if (isAuthenticated === null || isAuthenticated === false) {
//     return <Redirect to="/signin" />;
//   }

//   if (profile) {
//     // console.log('profile', profile);
//     if (profile.profile !== null && profile.loading === false) {
//       if (profile.profile.venues.length === 0) {
//         console.log('------> Hit Here');

//         // console.log('Redirect', profile.profile.venues);
//         // return <Redirect to="/onboarding" />;
//       }
//     }
//   }

//   let content;
//   if (recipe.loading) {
//     content = (
//       <div style={{ marginTop: '200px' }}>
//         <Spinner width="30px" />
//       </div>
//     );
//   } else {
//     if (recipe.recipes && recipe.recipes.length !== 0) {
//       content = <div>Recipes</div>;
//     } else {
//       content = '';
//     }
//   }

//   return (
//     <AuthMenu>
//       <section className="recipes">{content}</section>
//     </AuthMenu>
//   );
// };

// Recipes.propTypes = {
//   recipe: PropTypes.object.isRequired,
//   profile: PropTypes.object.isRequired,
//   isAuthenticated: PropTypes.bool,
//   venues: PropTypes.object.isRequired
// };

// // const actions = {
// //   loadVenues
// // };

// const mapState = state => ({
//   profile: state.profile,
//   isAuthenticated: state.auth.isAuthenticated,
//   venues: state.venues,
//   recipe: state.recipe
// });

// export default connect(mapState)(Recipes);
