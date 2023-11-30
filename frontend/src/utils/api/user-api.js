import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'http://localhost:3001/user';


export const userAPI = createApi({
  reducerPath: 'userAPI',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ username, email, password }) => ({
        url: '/register',
        method: 'POST',
        body: { username, email, password },
      }),
    }),
    confirmRegistration: builder.mutation({
      query: ({ username, email, password, confirmationCode }) => ({
        url: '/registrationConfirm',
        method: 'POST',
        body: { username, email, password, confirmationCode },
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
      })
    })
  }),
});

