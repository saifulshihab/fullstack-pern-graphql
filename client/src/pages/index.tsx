import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { PostEditAndDeleteButtons } from "../components/PostEditAndDeleteButtons";
import UpdootSection from "../components/UpdootSection";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

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
        </Flex>
        {!data ? (
          "Loading..."
        ) : (
          <Stack spacing={8}>
            {data?.posts.posts.map((post) =>
              !post ? null : (
                <Flex
                  key={post.id}
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  rounded="md"
                >
                  <UpdootSection post={post} />
                  <Flex w="full">
                    <Flex direction="column" flex={1}>
                      <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                        <Heading
                          fontSize="xl"
                          _hover={{ color: "blue" }}
                          cursor="pointer"
                        >
                          {post.title}
                        </Heading>
                      </NextLink>
                      <Box>
                        <Text mt={4}>{post.textSnippet}</Text>
                      </Box>
                    </Flex>
                    <Flex
                      direction="column"
                      align="center"
                      justifyContent="center"
                    >
                      <PostEditAndDeleteButtons
                        id={post.id}
                        creatorId={post.creator.id}
                      />
                      <Text fontSize="xs" fontStyle="italic">
                        posted by <strong>{post.creator.username}</strong>
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              )
            )}
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
