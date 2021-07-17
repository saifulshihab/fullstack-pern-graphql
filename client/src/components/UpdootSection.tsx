import React, { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [, vote] = useVoteMutation();
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
            postId: post?.id,
            value: 1,
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
            postId: post?.id,
            value: -1,
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
