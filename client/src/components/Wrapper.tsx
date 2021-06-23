import React from 'react';
import { Box } from '@chakra-ui/react';

interface wrapperProps {
  varient?: 'reguler' | 'small'
}

const Wrapper: React.FC<wrapperProps> = ({ children, varient = 'reguler' }) => {
  return (
    <Box mt={5} maxW={varient === 'reguler' ? '800px' : '400px'} height='100%' mx='auto'>
      {children}
    </Box>
  );
};

export default Wrapper;
