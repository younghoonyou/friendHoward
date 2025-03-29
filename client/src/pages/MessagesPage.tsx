import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import MessageWall from '../components/MessageWall';
import PhotoGallery from '../components/PhotoGallery';

const PageContainer = styled.div`
  padding: 6rem 2rem 4rem;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const PageTitle = styled(motion.h1)`
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
  font-size: 2.5rem;
`;

const PageDescription = styled(motion.p)`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
`;

const Section = styled.section`
  margin-bottom: 5rem;
`;

const MessagesPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Howard's Memory Wall
      </PageTitle>
      
      <PageDescription
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Photos and messages shared by Howard's friends and colleagues to wish him well on his journey from Canada to Taiwan.
      </PageDescription>
      
      <Section>
        <PhotoGallery />
      </Section>
      
      <Section>
        <MessageWall />
      </Section>
    </PageContainer>
  );
};

export default MessagesPage;