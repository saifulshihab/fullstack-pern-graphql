import React from "react";
import { Box, Flex, Link, Button } from "@chakra-ui/react";
import NavLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServerSide } from "../utils/isServerSide";
import NextLink from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  const [{ data }] = useMeQuery({ pause: isServerSide() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = null;

  if (!data?.me) {
    body = (
      <>
        <NavLink href="/login">
          <Link mr={2}>Login</Link>
        </NavLink>
        <NavLink href="/register">
          <Link>Register</Link>
        </NavLink>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button mr={2} size="sm" variant="solid" colorScheme="green">
            create post
          </Button>
        </NextLink>
        <Box mr={2}>{data?.me.username}</Box>
        <Button
          isLoading={logoutFetching}
          onClick={async () => {
            await logout();
            router.reload();
          }}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      p={3}
      zIndex={1}
      position="sticky"
      top={0}
      bg="whatsapp.500"
      alignItems="center"
    >
      <Flex flex={1} maxW={800} m="auto" align="center">
        <Box fontWeight="extrabold" fontSize="3xl" textColor="white">
          <NextLink href="/"> LiReddit</NextLink>
        </Box>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
