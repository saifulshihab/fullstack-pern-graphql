import React from "react";
import { Form, Formik } from "formik";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Box, Button, Spacer } from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";

const Login: React.FC<{}> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper varient="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
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

export default withUrqlClient(createUrqlClient)(Login);
