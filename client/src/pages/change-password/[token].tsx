import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const ChangePassword: NextPage<{}> = () => {
  const router = useRouter();

  const [, changePassword] = useChangePasswordMutation();

  const [tokenError, setTokenError] = useState("");

  console.log(router.query?.token);

  return (
    <Wrapper varient="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            token:
              typeof router.query.token === "string" ? router.query.token : "",
            newPassword: values.newPassword,
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            console.log(errorMap);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
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
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type="password"
              />
              {tokenError ? (
                <Flex>
                  <Box ox textColor="red">
                    {tokenError}
                  </Box>
                  <Box ml={2}>
                    <NextLink href="/forgot-password">
                      <Link>go get a new one</Link>
                    </NextLink>
                  </Box>
                </Flex>
              ) : null}
              <Button
                mt={4}
                type="submit"
                colorScheme="green"
                isLoading={isSubmitting}
              >
                change password
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
