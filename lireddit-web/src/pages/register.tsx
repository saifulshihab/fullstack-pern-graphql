import React from 'react';
import { Form, Formik } from 'formik';
import Wrapper from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper varient='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box
              d='flex'
              flexDirection='column'
              border='2px'
              borderRadius='lg'
              p={3}
              borderColor='gray.400'
            >
              <InputField
                name='username'
                placeholder='username'
                label='Username'
              />
              <Box p={2}></Box>
              <InputField
                name='password'
                placeholder='password'
                label='Password'
                type='password'
              />
            <Button mt={4} type='submit' colorScheme='green' isLoading={isSubmitting}>
              register
            </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
