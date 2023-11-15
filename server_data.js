const mode = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

const serverData = {
  'cors': {
    'prod': 'https://game2cube.onrender.com',
    'dev': 'http://localhost:3000',
  },
  'url': mode === 'prod' ?
    'https://game2cube-server.onrender.com'
    : 'http://localhost:3001',
}

export default serverData;
