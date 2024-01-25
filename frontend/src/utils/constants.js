export const cellPattern = {
  color: null,
  step: false,
  belong: null,
  sequenceNumber: null,
  focus: false
}

export const defaultAvatar = 'avatar001.svg';


export const BACKEND_URL = process.env.NODE_ENV === 'production' ?
  'https://game2cube-backend.onrender.com' : 'http://localhost:3001';
