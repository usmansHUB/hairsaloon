import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { styled, shimmer } from '../styles/stitches.config';
import { stylistsApi } from '../api/client';
import { StylistImage } from '../components/ui/SafeImage';

const Page = styled('div', { padding: '$12 $6 $20', maxWidth: '1280px', margin: '0 auto' });

const Header = styled('div', { textAlign: 'center', marginBottom: '$16' });
const Title = styled('h1', { fontFamily: '$display', fontSize: '$5xl', color: '$cream', marginBottom: '$4' });
const Sub = styled('p', { color: '$textMuted', maxWidth: 560, margin: '0 auto' });

const Grid = styled('div', {
  display: 'grid',
  gap: '$10',
  '@md': { gridTemplateColumns: 'repeat(2, 1fr)' },
});

const StylistCard = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$xl',
  overflow: 'hidden',
  transition: 'transform 0.35s, box-shadow 0.35s',

  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '$elevated',
  },

  '@md': { flexDirection: 'row' },
});

const ImageWrap = styled('div', {
  width: '100%',
  aspectRatio: '1',
  overflow: 'hidden',
  '@md': { width: '280px', flexShrink: 0 },

  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s',
  },

  [`${StylistCard}:hover & img`]: { transform: 'scale(1.05)' },
});

const Info = styled('div', { padding: '$8', flex: 1 });
const Name = styled('h3', { fontFamily: '$display', fontSize: '$3xl', color: '$cream', marginBottom: '$1' });
const Role = styled('span', { color: '$gold', fontSize: '$sm', letterSpacing: '0.06em', textTransform: 'uppercase' });
const Bio = styled('p', { color: '$textMuted', fontSize: '$sm', margin: '$5 0', lineHeight: 1.8 });
const Tags = styled('div', { display: 'flex', flexWrap: 'wrap', gap: '$2' });
const Tag = styled('span', {
  padding: '$1 $3',
  background: 'rgba(201, 169, 98, 0.1)',
  border: '1px solid $border',
  borderRadius: '$full',
  fontSize: '$xs',
  color: '$goldLight',
});
const Rating = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  marginTop: '$5',
  color: '$gold',
  fontSize: '$sm',
});

// Skeleton components for loading state
const SkeletonCard = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$xl',
  overflow: 'hidden',
  '@md': { flexDirection: 'row' },
});

const SkeletonImage = styled('div', {
  width: '100%',
  aspectRatio: '1',
  background: 'linear-gradient(90deg, #141210 25%, #221e1a 50%, #141210 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite linear`,
  '@md': { width: '280px', flexShrink: 0 },
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
      lg: { width: '80%' },
      md: { width: '60%' },
      sm: { width: '40%' },
    },
    height: {
      lg: { height: '24px' },
    },
  },
  defaultVariants: { width: 'full' },
});

export const Stylists = () => {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stylistsApi
      .getAll()
      .then((data) => {
        setStylists(Array.isArray(data) ? data : []);
      })
      .catch(() => setStylists([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Page>
      <Header>
        <Title>Meet Our Artists</Title>
        <Sub>Passionate stylists dedicated to bringing your vision to life.</Sub>
      </Header>

      <Grid>
        {loading
          ? [1, 2, 3, 4].map((n) => (
              <SkeletonCard key={n}>
                <SkeletonImage />
                <div style={{ padding: '2rem', flex: 1 }}>
                  <SkeletonLine width="md" height="lg" />
                  <SkeletonLine width="sm" />
                  <SkeletonLine width="full" css={{ marginTop: '1rem' }} />
                  <SkeletonLine width="lg" />
                  <SkeletonLine width="sm" css={{ marginTop: '1rem' }} />
                </div>
              </SkeletonCard>
            ))
          : stylists.length === 0
          ? (
            <p style={{ textAlign: 'center', color: 'var(--colors-textMuted)', gridColumn: '1 / -1' }}>
              No stylists found.
            </p>
          )
          : stylists.map((stylist, i) => (
              <motion.div
                key={stylist._id}
                initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <StylistCard>
                  <ImageWrap>
                    <StylistImage stylist={stylist} />
                  </ImageWrap>
                  <Info>
                    <Name>{stylist.name}</Name>
                    <Role>{stylist.title}</Role>
                    <Bio>{stylist.bio}</Bio>
                    <Tags>
                      {Array.isArray(stylist.specialties)
                        ? stylist.specialties.map((s) => <Tag key={s}>{s}</Tag>)
                        : null}
                    </Tags>
                    <Rating>
                      <Star size={16} fill="currentColor" />
                      {stylist.rating} · {stylist.yearsExperience} years
                    </Rating>
                  </Info>
                </StylistCard>
              </motion.div>
            ))}
      </Grid>
    </Page>
  );
};
