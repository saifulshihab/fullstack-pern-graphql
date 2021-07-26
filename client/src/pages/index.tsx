import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Layout from "../components/Layout";
import { PostEditAndDeleteButtons } from "../components/PostEditAndDeleteButtons";
import UpdootSection from "../components/UpdootSection";
import { usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data, loading, error, fetchMore } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null as null | string,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!data && !loading) {
    return (
      <div>
        <div>you got no data for some reason!</div>
        <Box color="red.500">Error :: {error?.message}</Box>
      </div>
    );
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
          <Text> Loading... </Text>
        ) : data.posts.posts.length < 1 ? (
          <Text color="gray.600" m="auto" mt={2}>
            No Posts Available!!
          </Text>
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
              isLoading={loading}
              variant="solid"
              colorScheme="messenger"
              onClick={() => {
                fetchMore({
                  variables: {
                    cursor:
                      data?.posts.posts[data?.posts.posts.length - 1].createdAt,
                  },
                  // updateQuery: (
                  //   previousValues,
                  //   { fetchMoreResult }
                  // ): PostsQuery => {
                  //   if (!fetchMoreResult) {
                  //     return previousValues as PostsQuery;
                  //   }

                  //   return {
                  //     __typename: "Query",
                  //     posts: {
                  //       __typename: "PaginatedPosts",
                  //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                  //       posts: [
                  //         ...(previousValues as PostsQuery).posts.posts,
                  //         ...(fetchMoreResult as PostsQuery).posts.posts,
                  //       ],
                  //     },
                  //   };
                  // },
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

export default withApollo({ ssr: true })(Index);
