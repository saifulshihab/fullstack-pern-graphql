import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

interface forgotPasswordProps {}

const ForgotPassword: React.FC<forgotPasswordProps> = ({}) => {
  const [complete, setComplete] = useState(false);

  const [forgotPassword] = useForgotPasswordMutation();

  return (
    <Wrapper varient="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });
          setComplete(true);
          //
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box
              bgColor="green.100"
              rounded="md"
              p={3}
              fontWeight="semibold"
              textColor="green.600"
            >
              An email was sent to your email address!!
            </Box>
          ) : (
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
                  name="email"
                  placeholder="email"
                  label="Enter Your Registered Email"
                  type="email"
                />

                <Button
                  mt={4}
                  type="submit"
                  colorScheme="green"
                  isLoading={isSubmitting}
                >
                  forgot password
                </Button>
              </Box>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
