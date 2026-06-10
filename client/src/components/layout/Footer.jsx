import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
import { styled } from '../../styles/stitches.config';

const FooterEl = styled('footer', {
  marginTop: 'auto',
  background: '$bgElevated',
  borderTop: '1px solid $border',
  padding: '$16 $6 $8',

  '@md': { padding: '$20 $10 $10' },
});

const Grid = styled('div', {
  maxWidth: '1280px',
  margin: '0 auto',
  display: 'grid',
  gap: '$10',
  '@md': { gridTemplateColumns: '2fr 1fr 1fr', gap: '$12' },
});

const Brand = styled('div', {});

const BrandName = styled('h3', {
  fontFamily: '$display',
  fontSize: '$3xl',
  color: '$gold',
  marginBottom: '$4',
});

const Desc = styled('p', {
  color: '$textMuted',
  fontSize: '$sm',
  maxWidth: '320px',
  lineHeight: 1.8,
});

const ColTitle = styled('h4', {
  fontSize: '$xs',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '$gold',
  marginBottom: '$5',
});

const LinkList = styled('ul', {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
});

const FooterLink = styled(Link, {
  color: '$textMuted',
  fontSize: '$sm',
  transition: 'color 0.2s',
  '&:hover': { color: '$gold' },
});

const ContactItem = styled('li', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '$3',
  color: '$textMuted',
  fontSize: '$sm',

  '& svg': { color: '$gold', flexShrink: 0, marginTop: 2 },
});

const Bottom = styled('div', {
  maxWidth: '1280px',
  margin: '$12 auto 0',
  paddingTop: '$8',
  borderTop: '1px solid $border',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: '$4',
  fontSize: '$xs',
  color: '$textMuted',
});

export const Footer = () => (
  <FooterEl>
    <Grid>
      <Brand>
        <BrandName>Luxe Hair Salon</BrandName>
        <Desc>
          Where artistry meets luxury. Experience world-class cuts, color, and treatments
          in an atmosphere of refined elegance.
        </Desc>
      </Brand>
      <div>
        <ColTitle>Explore</ColTitle>
        <LinkList>
          <li><FooterLink to="/services">Services</FooterLink></li>
          <li><FooterLink to="/stylists">Our Stylists</FooterLink></li>
          <li><FooterLink to="/book">Book Appointment</FooterLink></li>
        </LinkList>
      </div>
      <div>
        <ColTitle>Visit Us</ColTitle>
        <LinkList>
          <ContactItem><MapPin size={16} /> 128 Madison Avenue, New York, NY</ContactItem>
          <ContactItem><Phone size={16} /> +1 (555) 234-5678</ContactItem>
          <ContactItem><Mail size={16} /> hello@luxehair.com</ContactItem>
          <ContactItem><Instagram size={16} /> @luxehairsalon</ContactItem>
        </LinkList>
      </div>
    </Grid>
    <Bottom>
      <span>&copy; {new Date().getFullYear()} Luxe Hair Salon. All rights reserved.</span>
      <span>Crafted with MERN &amp; Stitches</span>
    </Bottom>
  </FooterEl>
);
