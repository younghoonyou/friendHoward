import React from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #ff6b6b;
  }
`;

const ScrollNavLink = styled(ScrollLink)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #ff6b6b;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo>好朋友</Logo>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <ScrollNavLink 
          to="photos" 
          smooth={true} 
          duration={500} 
          offset={-80}
        >
          Memories
        </ScrollNavLink>        
        <NavLink to="/upload">Upload</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;