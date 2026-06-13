import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export const PublicLayout = () => {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
};