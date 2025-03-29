import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Message {
  _id: string;
  name: string;
  message: string;
  date: string;
}

const MessageWallContainer = styled.div`
  padding: 1rem 0;
  width: 100%;
`;

const MessageGrid = styled.div`
  column-count: 1;
  column-gap: 1rem;
  margin: 1.5rem auto;
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;
  
  @media (min-width: 540px) {
    column-count: 2;
    column-gap: 1.25rem;
  }
  
  @media (min-width: 768px) {
    column-count: 2;
    column-gap: 1.5rem;
    padding: 0 1.5rem;
  }
  
  @media (min-width: 992px) {
    column-count: 3;
  }
  
  @media (min-width: 1200px) {
    column-count: 4;
  }
`;

const MessageCard = styled(motion.div)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  background-color: white;
  padding: 1.25rem;
  margin-bottom: 1rem;
  break-inside: avoid;
  page-break-inside: avoid; /* For older browsers */
  -webkit-column-break-inside: avoid; /* For older Chrome/Safari */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  /* Mobile touch feedback */
  &:active {
    transform: scale(0.98);
  }
  
  /* Only apply hover effects on devices that support hover */
  @media (hover: hover) {
    &:hover {
      transform: translateY(-5px) scale(1.01);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    }
  }
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const MessageName = styled.h3`
  margin: 0 0 0.8rem 0;
  font-size: 1.3rem;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
`;

const MessageText = styled.p`
  margin: 0;
  color: #444;
  font-size: 1.05rem;
  line-height: 1.7;
  white-space: pre-line; /* Preserves line breaks */
`;

const MessageDate = styled.div`
  font-size: 0.85rem;
  color: #999;
  margin-top: 1.2rem;
  text-align: right;
  font-style: italic;
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

const MessageWall: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('https://us-social-virtual-vote.com/api/messages');
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch messages');
        setLoading(false);
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <MessageWallContainer>
      <SectionTitle>Farewell Messages</SectionTitle>
      <SectionDescription>
        Read what friends and colleagues have to say about Howard and his journey. 
        Click the Upload button to add your own farewell message.
      </SectionDescription>
      <MessageGrid>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard 
              key={message._id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: Math.min(index * 0.05, 1),  // Cap delay at 1s for better performance
                ease: "easeOut" 
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <MessageName>{message.name}</MessageName>
              <MessageText>{message.message}</MessageText>
              <MessageDate>
                {new Date(message.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short', 
                  day: 'numeric'
                })}
              </MessageDate>
            </MessageCard>
          ))
        ) : (
          <MessageCard
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MessageName>No messages yet</MessageName>
            <MessageText>Be the first to leave a farewell message for Howard!</MessageText>
          </MessageCard>
        )}
      </MessageGrid>
    </MessageWallContainer>
  );
};

export default MessageWall;