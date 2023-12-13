import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const API_URL = 'http://localhost:3001/game';


export const gameAPI = createApi({
  reducerPath: 'gameAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `${token}`);
      }
    },
  }),
  endpoints: (builder) => ({
    add: builder.mutation({
      query: ({ token, data }) => ({
        url: '/add',
        method: 'POST',
        body: { token, data },
      }),
    }),
    get: builder.mutation({
      query: (params) => ({
        url: '/get',
        method: 'GET',
        params,
      }),
    }),
    toggleLike: builder.mutation({
      query: ({ levelId }) => ({
        url: '/toggle-like',
        method: 'POST',
        body: { levelId },
      }),
    }),
    removeLike: builder.mutation({
      query: ({ levelId }) => ({
        url: '/remove-like',
        method: 'POST',
        body: { levelId },
      }),
    })
  }),
});
