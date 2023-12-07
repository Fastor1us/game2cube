import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const API_URL = 'http://localhost:3001/game';


export const gameAPI = createApi({
  reducerPath: 'gameAPI',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    add: builder.mutation({
      query: ({ token, data }) => ({
        url: '/add',
        method: 'POST',
        body: { token, data },
      }),
    }),
  }),
});
