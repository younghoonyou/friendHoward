import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface FlagProps {
  scrollY: number;
}

const FlagContainer = styled(motion.div)`
  position: fixed;
  top: 80px;
  right: 20px;
  width: 100px;
  height: 60px;
  perspective: 1000px;
  z-index: 10;
`;

const Flag = styled(motion.div)<{ background: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.background});
  background-size: cover;
  background-position: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  backface-visibility: hidden;
  position: absolute;
  border-radius: 4px;
`;

const FlagTransition: React.FC<FlagProps> = ({ scrollY }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate transition progress (0-1) based on scroll
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    setProgress(currentProgress);
  }, [scrollY]);

  // Calculate rotation based on scroll progress
  const rotateY = progress * 180; // From 0 to 180 degrees

  return (
    <FlagContainer>
      {/* Canadian Flag */}
      <Flag 
        background="/canada-flag.png"
        animate={{ 
          rotateY: rotateY,
          opacity: 1 - progress
        }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Taiwan Flag */}
      <Flag 
        background="/taiwan-flag.png"
        initial={{ rotateY: -180 }}
        animate={{ 
          rotateY: -180 + rotateY,
          opacity: progress
        }}
        transition={{ duration: 0.1 }}
      />
    </FlagContainer>
  );
};

export default FlagTransition;