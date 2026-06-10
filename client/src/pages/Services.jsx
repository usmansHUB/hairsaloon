import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { styled, shimmer } from '../styles/stitches.config';
import { Card, CardImage, CardBody, CardTitle, CardText } from '../components/ui/Card';
import { ServiceImage } from '../components/ui/SafeImage';
import { Button } from '../components/ui/Button';
import { servicesApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Page = styled('div', { padding: '$12 $6 $20', maxWidth: '1280px', margin: '0 auto' });
const Header = styled('div', { textAlign: 'center', marginBottom: '$16' });
const Title = styled('h1', { fontFamily: '$display', fontSize: '$5xl', color: '$cream', marginBottom: '$4' });
const Sub = styled('p', { color: '$textMuted', maxWidth: 560, margin: '0 auto' });

const Filters = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$3',
  justifyContent: 'center',
  marginBottom: '$12',
});

const FilterBtn = styled('button', {
  padding: '$2 $5',
  borderRadius: '$full',
  fontSize: '$xs',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  border: '1px solid $border',
  color: '$textMuted',
  transition: 'all 0.2s',

  variants: {
    active: {
      true: {
        background: '$gold',
        color: '$bg',
        borderColor: '$gold',
      },
    },
  },
});

const Grid = styled('div', {
  display: 'grid',
  gap: '$8',
  '@md': { gridTemplateColumns: 'repeat(2, 1fr)' },
  '@lg': { gridTemplateColumns: 'repeat(3, 1fr)' },
});

const Meta = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '$5',
  paddingTop: '$5',
  borderTop: '1px solid $border',
});

const Price = styled('span', { fontFamily: '$display', fontSize: '$2xl', color: '$gold' });
const Duration = styled('span', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  fontSize: '$sm',
  color: '$textMuted',
});

// Skeleton components for loading state
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

const CATEGORIES = ['all', 'cut', 'color', 'style', 'treatment', 'grooming'];

export const Services = () => {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = category !== 'all' ? { category } : {};

    servicesApi
      .getAll(params)
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <Page>
      <Header>
        <Title>Our Services</Title>
        <Sub>Every service is a ritual — precision, care, and artistry in every detail.</Sub>
      </Header>

      <Filters>
        {CATEGORIES.map((cat) => (
          <FilterBtn
            key={cat}
            active={category === cat}
            onClick={() => setCategory(cat)}
          >
            {cat === 'all' ? 'All' : cat}
          </FilterBtn>
        ))}
      </Filters>

      {loading ? (
        <Grid>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <SkeletonCard key={n}>
              <SkeletonImage />
              <div style={{ padding: '1.5rem' }}>
                <SkeletonLine width="md" />
                <SkeletonLine />
                <SkeletonLine width="sm" />
              </div>
            </SkeletonCard>
          ))}
        </Grid>
      ) : services.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--colors-textMuted)' }}>No services found.</p>
      ) : (
        <Grid>
          {services.map((service, i) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hoverable>
                <CardImage>
                  <ServiceImage service={service} />
                </CardImage>
                <CardBody>
                  <CardTitle>{service.name}</CardTitle>
                  <CardText>{service.description}</CardText>
                  <Meta>
                    <Price>${service.price}</Price>
                    <Duration>
                      <Clock size={14} /> {service.duration} min
                    </Duration>
                  </Meta>
                  <Button
                    fullWidth
                    style={{ marginTop: '1.25rem' }}
                    onClick={() => navigate(`/book?service=${service._id}`)}
                  >
                    Book <ArrowRight size={16} />
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </Grid>
      )}
    </Page>
  );
};
