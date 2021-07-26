import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [register] = useRegisterMutation();
  const router = useRouter();

  return (
    <Wrapper varient="small">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.register.user,
                },
              });
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
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
                name="username"
                placeholder="username"
                label="Username"
              />
              <Box p={2}></Box>
              <InputField name="email" placeholder="email" label="Email" />
              <Box p={2}></Box>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              <Button
                mt={4}
                type="submit"
                colorScheme="green"
                isLoading={isSubmitting}
              >
                register
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
