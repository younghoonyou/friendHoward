import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 2rem;
  background-color: #333;
  color: white;
  text-align: center;
`;

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <FooterContainer>
      <p>Farewell Howard &copy; {year} - From Canada to Taiwan</p>
    </FooterContainer>
  );
};

export default Footer;