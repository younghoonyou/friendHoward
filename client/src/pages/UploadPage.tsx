import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import MessageForm from '../components/MessageForm';
import PhotoUploadForm from '../components/PhotoUploadForm';

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

const FormsContainer = styled.div`
  display: flex;
  justify-content: center;
  grid-template-columns: 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const UploadPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Share Your Memories
      </PageTitle>
      
      <FormsContainer>
        {/* <FormSection
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MessageForm />
        </FormSection> */}
        
        <FormSection
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <PhotoUploadForm />
        </FormSection>
      </FormsContainer>
    </PageContainer>
  );
};

export default UploadPage;