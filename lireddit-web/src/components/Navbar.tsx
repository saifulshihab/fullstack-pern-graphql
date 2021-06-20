import React from 'react';
import { Box, Flex, Link, Button } from '@chakra-ui/react';
import NavLink from 'next/link';
import { useMeQuery } from '../generated/graphql';

const Navbar = () => {
  const [{ data }] = useMeQuery();

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
        <Button variant='link'>Logout</Button>
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
