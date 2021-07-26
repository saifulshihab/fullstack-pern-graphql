import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import NextLink from "next/link";

interface PostEditAndDeleteButtonsProps {
  id: number;
  creatorId: number;
}

export const PostEditAndDeleteButtons: React.FC<PostEditAndDeleteButtonsProps> =
  ({ id, creatorId }) => {
    const { data: meData } = useMeQuery();
    const [deletePost] = useDeletePostMutation();

    if (meData?.me?.id !== creatorId) {
      return null;
    }

    return (
      <Flex align="center" mb={2}>
        <IconButton
          icon={<DeleteIcon />}
          aria-label="Delete Post"
          size="sm"
          mr={2}
          colorScheme="pink"
          onClick={() =>
            deletePost({
              variables: { id },
              update: (cache) => {
                cache.evict({ id: "Post:" + id });
              },
            })
          }
        />
        <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
          <IconButton
            icon={<EditIcon />}
            aria-label="Edit Post"
            size="sm"
            colorScheme="blue"
          />
        </NextLink>
      </Flex>
    );
  };
