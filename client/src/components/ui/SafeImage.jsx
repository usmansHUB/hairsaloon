import { useState, useEffect } from 'react';
import { styled, keyframes, shimmer } from '../../styles/stitches.config';
import { defaultServiceImage, defaultStylistImage } from '../../data/images';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const ImageWrapper = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'block',
  overflow: 'hidden',
  backgroundColor: '$bgCard',
});

const Skeleton = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(90deg, #141210 25%, #221e1a 50%, #141210 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite linear`,
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.3s ease-out',
});

const Spinner = styled('div', {
  width: '28px',
  height: '28px',
  border: '2px solid rgba(201, 169, 98, 0.1)',
  borderTopColor: '$gold',
  borderRadius: '50%',
  animation: `${rotate} 0.8s infinite linear`,
});

const StyledImg = styled('img', {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  transition: 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out',
  opacity: 0,
  transform: 'scale(1.03)',

  variants: {
    loaded: {
      true: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
  },
});

export const SafeImage = ({ src, alt, fallback = defaultServiceImage, eager = false, ...props }) => {
  const [url, setUrl] = useState(src || fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const nextUrl = src || fallback;
    setUrl(nextUrl);
    setLoaded(false);

    const img = new Image();
    img.src = nextUrl;

    const handleCached = () => {
      if (img.complete && img.naturalWidth > 0) {
        setLoaded(true);
      }
    };

    img.onload = handleCached;
    img.onerror = () => {
      setLoaded(true);
    };

    handleCached();

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallback]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    if (url !== fallback) {
      setUrl(fallback);
      setLoaded(false);
      return;
    }

    setLoaded(true);
  };

  return (
    <ImageWrapper>
      {!loaded && (
        <Skeleton>
          <Spinner />
        </Skeleton>
      )}
      <StyledImg
        {...props}
        src={url}
        alt={alt}
        loaded={loaded}
        onLoad={handleLoad}
        onError={handleError}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={eager ? 'high' : 'auto'}
      />
    </ImageWrapper>
  );
};

export const ServiceImage = ({ service, eager = false, ...props }) => (
  <SafeImage
    src={service?.image}
    alt={service?.name || 'Service'}
    fallback={defaultServiceImage}
    eager={eager}
    {...props}
  />
);

export const StylistImage = ({ stylist, eager = false, ...props }) => (
  <SafeImage
    src={stylist?.image}
    alt={stylist?.name || 'Stylist'}
    fallback={defaultStylistImage}
    eager={eager}
    {...props}
  />
);
