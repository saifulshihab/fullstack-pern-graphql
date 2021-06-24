import React from 'react';
import Navbar from '../components/Navbar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <div>
      <Navbar />
      Hello World!
      <br />
      {!data
        ? 'Loading...'
        : data?.posts.map((post) => <div key={post.id}>{post.title}</div>)}
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
