import React from "react";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import Layout from "../../components/Layout";

const Post = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching, error }] = usePostQuery({
    pause: intId === -1,
    variables: { postId: intId },
  });

  if (fetching) {
    return <Layout varient="reguler">loading...</Layout>;
  }

  if (error) {
    return <Layout varient="reguler">{error?.message}</Layout>;
  }

  if (!data?.post) {
    return (
      <Layout varient="reguler">
        <Box>Could not find the post!</Box>
      </Layout>
    );
  }

  return (
    <Layout varient="reguler">
      <Box>
        <Heading mb={3}>{data.post.title}</Heading>
        <Text>{data.post.text}</Text>
        <Flex mt={3} borderTop="gray" fontSize="xs">
          <Box flex="1">
            <Text fontStyle="italic">
              posted at <strong>{data.post.createdAt}</strong>
            </Text>
          </Box>
          <Box flex="1" textAlign="center">
            <Text fontStyle="italic">
              by <strong>{data.post.creator.username}</strong>
            </Text>
          </Box>
          <Box flex="1" textAlign="right">
            <Text fontStyle="italic">
              <strong>{data.post.points}</strong> points
            </Text>
          </Box>
        </Flex>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
