import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Photo {
  _id: string;
  name: string;
  description: string;
  imagePath: string;
  date: string;
}

const GalleryContainer = styled.div`
  padding: 1rem 0;
  width: 100%;
  overflow: hidden;
`;

const GalleryScroll = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 1.5rem 0;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  scroll-snap-type: x mandatory;
  scrollbar-width: none; /* Hide scrollbar on Firefox */
  -ms-overflow-style: none; /* Hide scrollbar on IE/Edge */
  
  /* Hide scrollbar on Chrome/Safari */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Ensure proper spacing */
  &::after {
    content: '';
    flex: 0 0 16px;
  }
`;

const PhotoCard = styled(motion.div)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  background-color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  /* Responsive card size */
  width: 85%;
  max-width: 300px;
  min-width: 250px;
  
  flex: 0 0 auto;
  scroll-snap-align: center;
  margin-left: 16px;
  
  &:first-child {
    margin-left: 16px;
  }
  
  @media (min-width: 768px) {
    width: 280px;
  }
  
  /* Touch-friendly hover effect - subtle on mobile */
  @media (hover: hover) {
    &:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
    }
  }
  
  /* Active state for mobile */
  &:active {
    transform: scale(0.98);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 260px;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  @media (min-width: 768px) {
    height: 280px;
  }
  
  /* Only apply hover effect on devices that support hover */
  @media (hover: hover) {
    &:hover {
      transform: scale(1.05);
    }
  }
`;

const PhotoInfo = styled.div`
  padding: 1rem;
`;

const PhotoName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #333;
`;

const PhotoDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2.2rem;
  color: #333;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, #4a90e2, #5637D3);
    margin: 0.8rem auto 0;
    border-radius: 2px;
  }
`;

const SectionDescription = styled.p`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
`;

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('https://us-social-virtual-vote.com/api/photos')
        setPhotos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch photos');
        setLoading(false);
        console.error('Error fetching photos:', err);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <GalleryContainer>
      <SectionTitle>Photo Memories</SectionTitle>
      <SectionDescription>
        Our memories with Howard
      </SectionDescription>
      <GalleryScroll>
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <PhotoCard 
              key={photo._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.08, 1) }}
              whileHover={{ y: -5 }}
            >
              <PhotoImage 
                src={`https://us-social-virtual-vote.com${photo.imagePath}`} 
                alt={photo.description || photo.name} 
                loading="lazy"
              />
              <PhotoInfo>
                <PhotoName>{photo.name}</PhotoName>
                {photo.description && (
                  <PhotoDescription>{photo.description}</PhotoDescription>
                )}
              </PhotoInfo>
            </PhotoCard>
          ))
        ) : (
          <PhotoCard 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PhotoInfo style={{ padding: '2rem', textAlign: 'center' }}>
              <PhotoName>No photos yet</PhotoName>
              <PhotoDescription>
                Be the first to share a photo memory with Howard!
              </PhotoDescription>
            </PhotoInfo>
          </PhotoCard>
        )}
      </GalleryScroll>
    </GalleryContainer>
  );
};

export default PhotoGallery;