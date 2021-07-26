import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import Layout from "../../components/Layout";
import { PostEditAndDeleteButtons } from "../../components/PostEditAndDeleteButtons";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { withApollo } from "../../utils/withApollo";

const Post = () => {
  const { data, loading, error } = useGetPostFromUrl();

  if (loading) {
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
      <Heading mb={3}>{data.post.title}</Heading>
      <Text>{data.post.text}</Text>
      <Flex mt={3} borderTop="gray" fontSize="xs">
        <Box flex="1">
          <Text fontStyle="italic">
            posted at{" "}
            <strong>
              {new Intl.DateTimeFormat("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(data.post.createdAt as any)}
            </strong>
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
      <Box mt={3}>
        <PostEditAndDeleteButtons
          id={data.post.id}
          creatorId={data.post.creator.id}
        />
      </Box>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
