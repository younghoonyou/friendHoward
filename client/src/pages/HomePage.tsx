import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import EarthScene from '../components/EarthScene';
import FlagTransition from '../components/FlagTransition';
import PhotoGallery from '../components/PhotoGallery';
import { Element } from 'react-scroll';

const HomeContainer = styled.div`
  position: relative;
`;

const Section = styled(Element)`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6rem 2rem;
  position: relative;
  z-index: 1;
`;

const HeroSection = styled(Section)`
  text-align: center;
  color: white;
`;

const AboutSection = styled(Section)`
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
`;

const JourneySection = styled(Section)`
  color: white;
`;

const MessagesSection = styled(Section)`
  background-color: rgba(255, 255, 255, 0.95);
  color: #333;
  min-height: auto;
  padding-top: 4rem;
  padding-bottom: 4rem;
`;

const PhotosSection = styled(Section)`
  background-color: rgba(245, 245, 245, 0.95);
  color: #333;
  min-height: auto;
  padding-top: 4rem;
  padding-bottom: 4rem;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const Subtitle = styled(motion.h2)`
  font-size: 2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const ContentContainer = styled.div`
  // max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

const JourneyInfo = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  margin: 0 auto;
`;

const JourneyTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const JourneyText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const HomePage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HomeContainer>
      <EarthScene scrollY={scrollY} />
      <FlagTransition scrollY={scrollY} />
      
      <HeroSection name="home">
        <ContentContainer>
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Howard
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            From Canada to Taiwan
          </Subtitle>
        </ContentContainer>
      </HeroSection>
  
      <PhotosSection name="photos" id='photos'>
        <ContentContainer>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}
          >
            Our Memories
          </motion.h2>
          <PhotoGallery />
        </ContentContainer>
      </PhotosSection>
    </HomeContainer>
  );
};

export default HomePage;