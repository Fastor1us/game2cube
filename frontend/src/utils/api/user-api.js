import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { BACKEND_URL } from '../constants';

const API_URL = `${BACKEND_URL}/user`;


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
      query: ({
        username, email, password, confirmationCode, avatar
      }) => ({
        url: '/registration-confirm',
        method: 'POST',
        body: {
          username, email, password, confirmationCode, avatar
        },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/login',
        method: 'POST',
        body: { email, password },
      }),
    }),
    authentication: builder.mutation({
      query: ({ token }) => ({
        url: '/authentication',
        method: 'POST',
        body: { token },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
      })
    }),
    delete: builder.mutation({
      query: ({ token }) => ({
        url: '/delete',
        method: 'POST',
        body: { token },
      }),
    }),
    change: builder.mutation({
      query: ({ token, ...params }) => ({
        url: '/change',
        method: 'POST',
        body: { token, ...params },
      }),
    }),
    recoveryEmail: builder.mutation({
      query: ({ email }) => ({
        url: '/recovery-email',
        method: 'POST',
        body: { email },
      }),
    }),
    recoveryCode: builder.mutation({
      query: ({ email, code }) => ({
        url: '/recovery-code',
        method: 'POST',
        body: { email, code },
      }),
    }),
    getAvatarList: builder.query({
      query: () => ({
        url: '/avatars',
      }),
    }),
    getAvatar: builder.mutation({
      query: (filename) => ({
        url: `/avatars/${filename}`,
      }),
    })
  }),
});

