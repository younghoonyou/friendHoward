import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #3a7bc8;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  padding: 1rem;
  background-color: #e7f7e7;
  color: #2e7d32;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
`;

const ErrorMessage = styled(motion.div)`
  padding: 1rem;
  background-color: #fde8e8;
  color: #c62828;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
`;

const MessageForm: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !message.trim()) {
      setError('Please fill out all fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await axios.post('https://us-social-virtual-vote.com/api/messages', {
        name,
        message
      });
      
      setSuccess(true);
      setName('');
      setMessage('');
      setLoading(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Failed to submit message. Please try again.');
      setLoading(false);
      console.error('Error submitting message:', err);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Leave a Message for Howard</FormTitle>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Your Name</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="message">Your Message</Label>
          <TextArea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your farewell message to Howard..."
          />
        </FormGroup>
        
        <SubmitButton 
          type="submit" 
          disabled={loading}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Submitting...' : 'Submit Message'}
        </SubmitButton>
        
        {success && (
          <SuccessMessage
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your message has been submitted successfully!
          </SuccessMessage>
        )}
        
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </ErrorMessage>
        )}
      </Form>
    </FormContainer>
  );
};

export default MessageForm;