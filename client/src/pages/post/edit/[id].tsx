import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import Layout from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { useGetIntId } from "../../../utils/useGetIntId";
import { withApollo } from "../../../utils/withApollo";

const EditPost = () => {
  const router = useRouter();
  const intId = useGetIntId();
  const { data, loading, error } = usePostQuery({
    skip: intId === -1,
    variables: { postId: intId },
  });

  const [updatePost] = useUpdatePostMutation();

  if (loading) {
    return <Layout varient="reguler">loading...</Layout>;
  }

  return (
    <Layout varient="small">
      <Formik
        initialValues={{ title: data?.post?.title, text: data?.post?.text }}
        onSubmit={async (values) => {
          const { errors, data } = await updatePost({
            variables: { id: intId, ...values },
          });
          if (!errors) {
            router.push("/");
          }
          if (data?.updatePost?.text) {
            router.back();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="post title" label="Title" />
            <Box p={2}></Box>
            <InputField
              textarea
              name="text"
              placeholder="post body"
              label="Description"
            />

            <Button
              mt={4}
              type="submit"
              colorScheme="green"
              isLoading={isSubmitting}
            >
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
