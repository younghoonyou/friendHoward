import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';
import Carousel from 'react-multi-carousel';
import {Dialog, DialogContent, DialogTitle, Typography, Collapse, CardContent,Container,CardHeader, IconButton} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; 
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'; 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import 'react-multi-carousel/lib/styles.css';


interface Photo {
  _id: string;
  name: string;
  description: string;
  imagePath: string;
  date: string;
  message: string;
}

const GalleryContainer = styled.div`
  padding: 1rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const CarouselContainer = styled(Carousel)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`

const PhotoCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  background-color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  /* Responsive card size */
  width: 100%;
  // max-width: 300px;
  // min-width: 250px;
  
  flex: 0 0 auto;
  // scroll-snap-align: center;
  // margin-left: 16px;
  
  // &:first-child {
  //   margin-left: 16px;
  // }
  
  @media (min-width: 768px) {
    width: 280px;
    height: 100%;
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
  object-fit: scale-downs;
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
  font-weight: bold;
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
  const [autoPlay, setAutoPlay] = useState(true);
  const [collapseOpen, setCollapseOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);

  const handleClick = (photo:Photo|null) => {
    console.log(photo);
    setAutoPlay(false);
    setSelectedImage(photo);
  };

  const handleClose = () => {
    setAutoPlay(true);
    setSelectedImage(null);
  };

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: {max: 4000, min: 3000},
      items: 5,
    },
    desktop: {
      breakpoint: {max: 3000, min: 1024},
      items: 4,
    },
    tablet: {
      breakpoint: {max: 1024, min: 464},
      items: 2,
    },
    mobile: {
      breakpoint: {max: 430, min: 0},
      items: 1,
    },
  };


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/photos`)
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

  const handleDialog = () => {

  }

  return (
    <GalleryContainer>
      <SectionTitle>Photos</SectionTitle>
      <SectionDescription>
        Photos with Howard
      </SectionDescription>
      <CarouselContainer
        responsive={responsive}
        partialVisible
        ssr
        className='Caruosel-Photo'
        autoPlay={autoPlay}
        autoPlaySpeed={2000}
        infinite={true}
        arrows={false}
      >
        {photos.map((photo, idx) => {
          return (
            <PhotoCard 
              key={photo._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: Math.min(idx * 0.08, 1) }}
              whileHover={{ y: -5 }}
              onClick={handleDialog}
            >
            <PhotoImage 
                src={`${process.env.REACT_APP_API_ENDPOINT}${photo.imagePath}`} 
                alt={photo.description || photo.name} 
                width='100'
                loading="lazy"
                onClick={() => {
                  handleClick(photo);
                }}
              />
              <PhotoInfo>
                <PhotoName>{photo.name}</PhotoName>
                {photo.date && (
                  <PhotoDescription>{photo.date.split('T')[0]}</PhotoDescription>
                )}
              </PhotoInfo>
              </PhotoCard>
          );
        })}
      </CarouselContainer>
      <Dialog open={selectedImage !== null} onClose={handleClose} className='Dialog-container'>
        <DialogContent>
          <Typography>
            <img src={`${process.env.REACT_APP_API_ENDPOINT}${selectedImage?.imagePath}`} alt={`${selectedImage?.name}${selectedImage?.date}`} width='100%'/>
          </Typography>
        </DialogContent>
        <DialogTitle id='alert-dialog-title'>
          {selectedImage?.description}
        </DialogTitle>
        <DialogContent>
          {selectedImage?.date.split('T')[0]}<span>with {selectedImage?.name}</span>
        </DialogContent>
      </Dialog>
      <SectionTitle>Messages</SectionTitle>
      <CardHeader 
                    title="Our Messages"
                    action={ 
                        <IconButton 
                            onClick={() => setCollapseOpen(!collapseOpen)} 
                            aria-label="expand"
                            size="large"
                        > 
                            {collapseOpen ? <KeyboardArrowUpIcon /> 
                                : <KeyboardArrowDownIcon />} 
                        </IconButton> 
                    } 
                ></CardHeader> 
      <Collapse in={collapseOpen} timeout="auto"
                        unmountOnExit> 
                        <CardContent> 
                            <Container sx={{  
                                height: 'auto',  
                                lineHeight: 2  
                            }}> 
                                <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {photos.map((photo) => (
            <TableRow
              key={photo.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {photo.name}
              </TableCell>
              <TableCell align="left"><span style={{flexWrap:'wrap'}}>{photo.message}</span></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
                            </Container> 
                        </CardContent> 
                    </Collapse> 
    </GalleryContainer>
  );
};

export default PhotoGallery;