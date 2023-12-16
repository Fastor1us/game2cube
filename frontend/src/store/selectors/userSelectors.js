export const userSelector = state => state.user;

export const isAuthSelector = state => userSelector(state).isAuth;

export const avatarListSelector = state => userSelector(state).avatarList;

export const avatarSelector = state => userSelector(state).avatar;
