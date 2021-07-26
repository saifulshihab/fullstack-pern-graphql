import { Box, Button, Flex, Link, Spacer } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";

const Login: React.FC<{}> = ({}) => {
  const [login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper varient="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box
              d="flex"
              flexDirection="column"
              border="2px"
              borderRadius="lg"
              p={3}
              borderColor="teal.300"
            >
              <InputField
                name="usernameOrEmail"
                placeholder="usernameOrEmail"
                label="Username or Email"
              />
              <Box p={2}></Box>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              <Flex alignItems="center">
                <Button
                  mt={4}
                  type="submit"
                  colorScheme="green"
                  isLoading={isSubmitting}
                >
                  login
                </Button>
                <Spacer />
                <NextLink href="/forgot-password">
                  <Link textColor="blue.400">forgot password</Link>
                </NextLink>
              </Flex>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);
