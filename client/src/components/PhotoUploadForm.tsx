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
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const FileInput = styled.input`
  margin-top: 0.5rem;
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

const PreviewImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin-top: 1rem;
`;

const PhotoUploadForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !image) {
      setError('Please provide your name and upload an image');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', image);
      
      await axios.post('https://us-social-virtual-vote.com/api/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess(true);
      setName('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
      setLoading(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Failed to upload photo. Please try again.');
      setLoading(false);
      console.error('Error uploading photo:', err);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Share a Photo Memory</FormTitle>
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
          <Label htmlFor="description">Photo Description (optional)</Label>
          <TextArea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this photo memory..."
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="image">Upload Photo</Label>
          <FileInput
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <PreviewImage src={imagePreview} alt="Preview" />
          )}
        </FormGroup>
        
        <SubmitButton 
          type="submit" 
          disabled={loading}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Uploading...' : 'Upload Photo'}
        </SubmitButton>
        
        {success && (
          <SuccessMessage
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your photo has been uploaded successfully!
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

export default PhotoUploadForm;