import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import {Spots} from './components/Spots/spots'
import {Spot} from './components/Spots/spot'
import CreateSpot from './components/Spots/newSpot'
import UpdateSpot from './components/Spots/updateSpot';
import { CurrentSpots } from './components/ManageSpots/ManageSpots';
import { CurrentReviews } from './components/Reviews/ManageReviews';


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Spots />
      },
      {
        path: '/spots/:id',
        element: <Spot />
      },
      {
        path: '/spots/new',
        element: <CreateSpot />
      },
      {
        path: '/spots/current',
        element: <CurrentSpots />
      },
      {
        path: '/spots/:id/edit',
        element: <UpdateSpot />
      },
      {
        path: '/reviews/current',
        element: <CurrentReviews />
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;