import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Award, Clock } from 'lucide-react';
import { styled, fadeUp, shimmer } from '../styles/stitches.config';
import { Button } from '../components/ui/Button';
import { Card, CardImage, CardBody, CardTitle, CardText } from '../components/ui/Card';
import { servicesApi, stylistsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ServiceImage, StylistImage } from '../components/ui/SafeImage';

const Hero = styled('section', {
  position: 'relative',
  minHeight: '92vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

const HeroBg = styled('div', {
  position: 'absolute',
  inset: 0,
  backgroundImage: 'url(/images/services/balayage-color.webp)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(10,9,8,0.92) 0%, rgba(10,9,8,0.7) 50%, rgba(10,9,8,0.85) 100%)',
  },
});

const HeroContent = styled('div', {
  position: 'relative',
  zIndex: 1,
  maxWidth: '900px',
  textAlign: 'center',
  padding: '$8 $6',
});

const Eyebrow = styled('span', {
  display: 'inline-block',
  fontSize: '$xs',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '$gold',
  marginBottom: '$6',
  animation: `${fadeUp} 0.8s ease forwards`,
});

const HeroTitle = styled('h1', {
  fontFamily: '$display',
  fontSize: '$hero',
  fontWeight: 700,
  lineHeight: 1.1,
  color: '$cream',
  marginBottom: '$6',

  '& em': {
    fontStyle: 'italic',
    color: '$gold',
  },
});

const HeroSub = styled('p', {
  fontSize: '$lg',
  color: '$creamMuted',
  maxWidth: '560px',
  margin: '0 auto $10',
  lineHeight: 1.8,
});

const HeroActions = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$4',
  justifyContent: 'center',
});

const Section = styled('section', {
  padding: '$20 $6',
  maxWidth: '1280px',
  margin: '0 auto',

  '@md': { padding: '$24 $10' },
});

const SectionHeader = styled('div', {
  textAlign: 'center',
  marginBottom: '$16',
});

const SectionLabel = styled('span', {
  fontSize: '$xs',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '$gold',
});

const SectionTitle = styled('h2', {
  fontFamily: '$display',
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  color: '$cream',
  marginTop: '$3',
});

const Grid3 = styled('div', {
  display: 'grid',
  gap: '$8',
  '@md': { gridTemplateColumns: 'repeat(3, 1fr)' },
});

const ServiceGrid = styled('div', {
  display: 'grid',
  gap: '$8',
  '@md': { gridTemplateColumns: 'repeat(3, 1fr)' },
});

const ArtistGrid = styled('div', {
  display: 'grid',
  gap: '$8',
  '@md': { gridTemplateColumns: 'repeat(2, 1fr)' },
  '@lg': { gridTemplateColumns: 'repeat(4, 1fr)' },
});

const ArtistCard = styled('div', {
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$lg',
  overflow: 'hidden',
  textAlign: 'center',
  transition: 'transform 0.35s, box-shadow 0.35s',

  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '$elevated',
  },
});

const ArtistPhoto = styled('div', {
  aspectRatio: '1',
  overflow: 'hidden',

  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

const ArtistName = styled('h3', {
  fontFamily: '$display',
  fontSize: '$xl',
  color: '$cream',
  margin: '$5 0 $1',
});

const ArtistRole = styled('p', {
  fontSize: '$xs',
  color: '$gold',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  paddingBottom: '$5',
});

const StatCard = styled('div', {
  textAlign: 'center',
  padding: '$8',
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$lg',

  '& svg': { color: '$gold', marginBottom: '$4' },
});

const StatNum = styled('div', {
  fontFamily: '$display',
  fontSize: '$4xl',
  color: '$gold',
  fontWeight: 700,
});

const StatLabel = styled('div', {
  fontSize: '$sm',
  color: '$textMuted',
  marginTop: '$2',
});

const PriceTag = styled('span', {
  display: 'inline-block',
  marginTop: '$4',
  fontFamily: '$display',
  fontSize: '$2xl',
  color: '$gold',
});

// Skeleton card for loading state
const SkeletonCard = styled('div', {
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$lg',
  overflow: 'hidden',
});

const SkeletonImage = styled('div', {
  aspectRatio: '4/3',
  background: 'linear-gradient(90deg, #141210 25%, #221e1a 50%, #141210 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite linear`,
});

const SkeletonArtistImage = styled('div', {
  aspectRatio: '1',
  background: 'linear-gradient(90deg, #141210 25%, #221e1a 50%, #141210 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite linear`,
});

const SkeletonLine = styled('div', {
  height: '16px',
  borderRadius: '$sm',
  background: 'linear-gradient(90deg, #141210 25%, #221e1a 50%, #141210 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite linear`,
  margin: '$2 0',
  variants: {
    width: {
      full: { width: '100%' },
      md: { width: '60%' },
      sm: { width: '40%' },
    },
  },
  defaultVariants: { width: 'full' },
});

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

export const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingStylists, setLoadingStylists] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    servicesApi
      .getAll({ featured: 'true' })
      .then((data) => setFeatured(Array.isArray(data) ? data : []))
      .catch(() => setFeatured([]))
      .finally(() => setLoadingServices(false));
    stylistsApi
      .getAll()
      .then((data) => setArtists(Array.isArray(data) ? data : []))
      .catch(() => setArtists([]))
      .finally(() => setLoadingStylists(false));
  }, []);

  return (
    <>
      <Hero>
        <HeroBg />
        <HeroContent>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Eyebrow>Premium Hair Experience</Eyebrow>
            <HeroTitle>
              Redefine Your <em>Signature</em> Look
            </HeroTitle>
            <HeroSub>
              Indulge in bespoke cuts, luminous color, and transformative treatments
              crafted by award-winning stylists in our sanctuary of style.
            </HeroSub>
            <HeroActions>
              <Button size="lg" onClick={() => navigate('/book')}>
                Book Your Visit <ArrowRight size={18} />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/services')}>
                Explore Services
              </Button>
            </HeroActions>
          </motion.div>
        </HeroContent>
      </Hero>

      <Section>
        <Grid3>
          {[
            { icon: Sparkles, num: '15+', label: 'Years of Excellence' },
            { icon: Award, num: '50K+', label: 'Happy Clients' },
            { icon: Clock, num: 'Same Day', label: 'Booking Available' },
          ].map((stat, i) => (
            <motion.div key={stat.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <StatCard>
                <stat.icon size={32} />
                <StatNum>{stat.num}</StatNum>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            </motion.div>
          ))}
        </Grid3>
      </Section>

      <Section>
        <SectionHeader>
          <SectionLabel>Signature Services</SectionLabel>
          <SectionTitle>Curated For You</SectionTitle>
        </SectionHeader>
        <ServiceGrid>
          {loadingServices
            ? [1, 2, 3].map((n) => (
                <SkeletonCard key={n}>
                  <SkeletonImage />
                  <div style={{ padding: '1.5rem' }}>
                    <SkeletonLine width="md" />
                    <SkeletonLine />
                    <SkeletonLine width="sm" />
                  </div>
                </SkeletonCard>
              ))
            : featured.map((service, i) => (
                <motion.div key={service._id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                  <Card hoverable>
                    <CardImage>
                      <ServiceImage service={service} />
                    </CardImage>
                    <CardBody>
                      <CardTitle>{service.name}</CardTitle>
                      <CardText>{service.description}</CardText>
                      <PriceTag>${service.price}</PriceTag>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
        </ServiceGrid>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Button variant="outline" onClick={() => navigate('/services')}>
            View All Services <ArrowRight size={16} />
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <SectionLabel>Our Artists</SectionLabel>
          <SectionTitle>Meet The Team</SectionTitle>
        </SectionHeader>
        <ArtistGrid>
          {loadingStylists
            ? [1, 2, 3, 4].map((n) => (
                <SkeletonCard key={n}>
                  <SkeletonArtistImage />
                  <div style={{ padding: '1rem', textAlign: 'center' }}>
                    <SkeletonLine width="md" css={{ margin: '0.5rem auto' }} />
                    <SkeletonLine width="sm" css={{ margin: '0.25rem auto' }} />
                  </div>
                </SkeletonCard>
              ))
            : artists.map((stylist, i) => (
                <motion.div
                  key={stylist._id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <ArtistCard>
                    <ArtistPhoto>
                      <StylistImage stylist={stylist} />
                    </ArtistPhoto>
                    <ArtistName>{stylist.name}</ArtistName>
                    <ArtistRole>{stylist.title}</ArtistRole>
                  </ArtistCard>
                </motion.div>
              ))}
        </ArtistGrid>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Button variant="outline" onClick={() => navigate('/stylists')}>
            View All Artists <ArrowRight size={16} />
          </Button>
        </div>
      </Section>

      <Section style={{ textAlign: 'center', background: 'linear-gradient(180deg, transparent, rgba(201,169,98,0.05))', borderRadius: '28px', margin: '0 1.5rem 5rem' }}>
        <SectionLabel>Ready to Transform?</SectionLabel>
        <SectionTitle style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
          Your Chair Awaits
        </SectionTitle>
        <p style={{ color: 'var(--colors-textMuted)', maxWidth: 480, margin: '0 auto 2rem' }}>
          Join thousands who trust Luxe Hair for their most important moments.
        </p>
        <Button size="lg" onClick={() => navigate('/book')}>
          Reserve Your Spot
        </Button>
      </Section>
    </>
  );
};
