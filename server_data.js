
const serverData = {
  'cors': {
    'prod': 'https://game2cube.onrender.com',
    'dev': 'http://localhost:3000',
  },
  'url': process.env.NODE_ENV === 'production' ?
    'https://game2cube-server.onrender.com'
    : 'http://localhost:3001',
}

module.exports = serverData;
