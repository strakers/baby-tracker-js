import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  useLocation,
  useNavigationType,
  matchRoutes,
} from 'react-router-dom';

import { NoteEntry } from '../components/entries/NoteEntry';

export const routes = createRoutesFromElements(
  <>
    <Route
      path="/"
      id="root"
      element={
        <div>
          <Outlet />
        </div>
      }
      // loader={menuLoader}
      // error={<div className="main site-error menu-loading-error">error</div>}
    >
      <Route
        index
        element={<div>baby app</div>}
        // loader={homePageLoader}
        // errorElement={<PageServiceFailureError />}
      />

      <Route
        id="add"
        path="add"
        element={<div>add record</div>}
        // loader={searchLoader}
        // errorElement={<PageServiceFailureError />}
      >
        <Route
          id="note"
          path="note"
          element={<NoteEntry />}
          // loader={searchLoader}
          // errorElement={<PageServiceFailureError />}
        />
      </Route>
    </Route>
  </>
);

export const router = createBrowserRouter(routes);

console.log(routes);
