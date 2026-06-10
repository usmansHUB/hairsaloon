import { Outlet } from 'react-router-dom';
import { styled } from '../../styles/stitches.config';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const Main = styled('main', {
  flex: 1,
  paddingTop: '72px',
});

export const Layout = () => (
  <>
    <Navbar />
    <Main>
      <Outlet />
    </Main>
    <Footer />
  </>
);
