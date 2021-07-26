import React, { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import { ApolloCache, gql } from "@apollo/client";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;

    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment _ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [vote] = useVoteMutation();
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");

  // console.log(post);
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("updoot-loading");
          await vote({
            variables: {
              postId: post?.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        aria-label="updoot post"
        icon={<ChevronUpIcon />}
        size="sm"
        isLoading={loadingState === "updoot-loading"}
        _hover={{ bg: "green.500" }}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        rounded="sm"
      />
      <Text fontSize="sm">{post.points}</Text>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downdoot-loading");
          await vote({
            variables: {
              postId: post?.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        aria-label="downdoot post"
        icon={<ChevronDownIcon />}
        size="sm"
        isLoading={loadingState === "downdoot-loading"}
        _hover={{ bg: "red.500" }}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        rounded="sm"
      />
    </Flex>
  );
};

export default UpdootSection;
