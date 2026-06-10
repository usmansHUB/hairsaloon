import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Scissors } from 'lucide-react';
import { styled } from '../../styles/stitches.config';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Nav = styled('header', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  padding: '$4 $6',
  background: 'rgba(10, 9, 8, 0.75)',
  backdropFilter: 'blur(16px)',
  borderBottom: '1px solid $border',

  '@md': { padding: '$4 $10' },
});

const Inner = styled('div', {
  maxWidth: '1280px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Logo = styled(Link, {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  fontFamily: '$display',
  fontSize: '$2xl',
  fontWeight: 700,
  color: '$gold',
  letterSpacing: '0.02em',

  '& svg': { width: 28, height: 28 },
});

const Links = styled('nav', {
  display: 'none',
  alignItems: 'center',
  gap: '$8',

  '@lg': { display: 'flex' },
});

const navLinkStyle = {
  fontSize: '$sm',
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '$creamMuted',
  transition: 'color 0.2s',
  position: 'relative',

  '&.active, &:hover': { color: '$gold' },
  '&.active::after': {
    content: '""',
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: 1,
    background: '$gold',
  },
};

const NavItem = styled(NavLink, navLinkStyle);

const Actions = styled('div', {
  display: 'none',
  alignItems: 'center',
  gap: '$4',

  '@lg': { display: 'flex' },
});

const MobileToggle = styled('button', {
  display: 'flex',
  color: '$gold',
  '@lg': { display: 'none' },
});

const MobileMenu = styled('div', {
  position: 'fixed',
  inset: 0,
  top: 72,
  background: '$overlay',
  backdropFilter: 'blur(20px)',
  padding: '$8',
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
  zIndex: 99,

  '@lg': { display: 'none' },
});

const MobileLink = styled(NavLink, {
  ...navLinkStyle,
  fontSize: '$xl',
  padding: '$4 0',
  borderBottom: '1px solid $border',
});

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  const links = (
    <>
      <NavItem to="/" end onClick={close}>Home</NavItem>
      <NavItem to="/services" onClick={close}>Services</NavItem>
      <NavItem to="/stylists" onClick={close}>Stylists</NavItem>
      <NavItem to="/book" onClick={close}>Book</NavItem>
      {user && <NavItem to="/appointments" onClick={close}>My Visits</NavItem>}
    </>
  );

  return (
    <>
      <Nav>
        <Inner>
          <Logo to="/" onClick={close}>
            <Scissors />
            Luxe Hair
          </Logo>
          <Links>{links}</Links>
          <Actions>
            {user ? (
              <>
                <span style={{ color: 'var(--colors-creamMuted)', fontSize: '0.875rem' }}>
                  Hi, {user.name.split(' ')[0]}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
                <Button size="sm" onClick={() => navigate('/register')}>Join Us</Button>
              </>
            )}
            <Button size="sm" onClick={() => navigate('/book')}>
              Book Now
            </Button>
          </Actions>
          <MobileToggle onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={28} /> : <Menu size={28} />}
          </MobileToggle>
        </Inner>
      </Nav>
      {open && (
        <MobileMenu>
          {links}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {user ? (
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => { close(); navigate('/login'); }}>Sign In</Button>
                <Button onClick={() => { close(); navigate('/register'); }}>Join Us</Button>
              </>
            )}
            <Button onClick={() => { close(); navigate('/book'); }}>Book Now</Button>
          </div>
        </MobileMenu>
      )}
    </>
  );
};
