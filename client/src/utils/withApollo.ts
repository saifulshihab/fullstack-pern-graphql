import { ApolloClient, InMemoryCache } from "@apollo/client";
import { withApollo as createWithApollo } from "./createWithApollo";
import { PaginatedPosts } from "../generated/graphql";
import { NextPageContext } from "next";

const client = (ctx?: NextPageContext) =>
  new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL as string,
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  // __typename: incoming?.__typename,
                  // hasMore: incoming?.hasMore
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming?.posts],
                };
              },
            },
          },
        },
      },
    }),
    credentials: "include",
  });

export const withApollo = createWithApollo(client);
