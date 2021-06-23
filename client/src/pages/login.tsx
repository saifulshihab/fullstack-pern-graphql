import React from 'react';
import { Form, Formik } from 'formik';
import Wrapper from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import {useRouter} from 'next/router'


const Login: React.FC<{}> = ({}) => {

  const [, login] = useLoginMutation()
  const router = useRouter()

  return (
    <Wrapper varient='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({options: values});
          if(response.data?.login.errors){
            setErrors(toErrorMap(response.data.login.errors))
          } else if(response.data?.login.user){
            router.push('/')
          }         
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
              borderColor='teal.300'
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
              login
            </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
