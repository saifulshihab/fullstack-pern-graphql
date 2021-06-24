import React from 'react';
import { Box, Flex, Link, Button } from '@chakra-ui/react';
import NavLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServerSide } from '../utils/isServerSide';

const Navbar = () => {
  
  const [{ data }] = useMeQuery({pause: isServerSide()});
  const [{fetching: logoutFetching}, logout] =  useLogoutMutation()  

  let body = null;

  if (!data?.me) {
    body = (
      <>
        <NavLink href='/login'>
          <Link mr={2}>Login</Link>
        </NavLink>
        <NavLink href='/register'>
          <Link>Register</Link>
        </NavLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data?.me.username}</Box>
        <Button isLoading={logoutFetching} onClick={() => logout()} variant='link'>Logout</Button>
      </Flex>
    );
  }

  return (
    <Flex p={4} bg='whatsapp.500'>
      <Box fontWeight='bold' fontSize='xl'>
        Lireddit
      </Box>
      <Box ml='auto'>{body}</Box>
    </Flex>
  );
}; 

export default Navbar;
