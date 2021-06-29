import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import Layout from "../components/Layout";
import { Button } from "@chakra-ui/react";
import NextLink from "next/link";

const Index = () => {
  const [{ data }] = usePostsQuery({ variables: { limit: 10 } });
  return (
    <>
      <Layout varient="reguler">
        <NextLink href="/create-post">
          <Button size="sm" variant="solid" colorScheme="green">
            create post
          </Button>
        </NextLink>
        {!data
          ? "Loading..."
          : data?.posts.map((post) => <div key={post.id}>{post.title}</div>)}
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
