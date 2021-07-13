import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import Layout from "../components/Layout";
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import NextLink from "next/link";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

  console.log(variables);

  if (!data && !fetching) {
    return <div>you got no data for some reason!</div>;
  }
  return (
    <>
      <Layout varient="reguler">
        <Flex alignItems="center" my={3}>
          <Text fontSize="2xl" fontWeight="bold">
            Recent Posts
          </Text>
          <Spacer />
          <NextLink href="/create-post">
            <Button size="sm" variant="solid" colorScheme="green">
              create post
            </Button>
          </NextLink>
        </Flex>
        {!data ? (
          "Loading..."
        ) : (
          <Stack spacing={8}>
            {data?.posts.posts.map((post) => (
              <Box key={post.id} p={5} shadow="md" borderWidth="1px">
                <Flex>
                  <Heading fontSize="xl">{post.title}</Heading>
                  <Spacer />
                  <Text fontSize="xs" fontStyle="italic">
                    posted by <strong>{post.creator.username}</strong>
                  </Text>
                </Flex>
                <Text mt={4}>{post.textSnippet}</Text>
              </Box>
            ))}
          </Stack>
        )}
        {data && data?.posts.hasMore ? (
          <Flex alignItems="center" justifyContent="center" my={3}>
            <Button
              isLoading={fetching}
              variant="solid"
              colorScheme="messenger"
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data?.posts.posts[data?.posts.posts.length - 1].createdAt,
                });
              }}
            >
              load more
            </Button>
          </Flex>
        ) : null}
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
