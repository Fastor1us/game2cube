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
    get: builder.mutation({
      query: (params) => ({
        url: '/get',
        method: 'GET',
        params,
      }),
    }),
  }),
});

// get: builder.mutation({
//   query: (params) => ({
//     url: `/get${Object.keys(params).length > 0 ? ('?' +
//       Object.entries(params).map((param) => `${param[0]}=${param[1]}`).join('&')
//     ) : ''}`,
//     method: 'GET',
//   }),
// })
