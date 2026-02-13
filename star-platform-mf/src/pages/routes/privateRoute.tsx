// // host/src/routes/PrivateRoute.jsx
// import React from "react";
// import { Route, Redirect } from "react-router-dom";
// import { isSessionValid } from "../utils/TokenUtils";

// function PrivateRoute({ component: Component, ...rest }) {
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isSessionValid() ? (
//           <Component {...props} />
//         // ) : (
//           // <Redirect to="/login" />
//         )
//       }
//     />
//   );
// }

// export default PrivateRoute;
