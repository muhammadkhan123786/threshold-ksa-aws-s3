const tokenSelector = (state: any) => state.auth?.entities?.access_token;
const refreshTokenSelector = (state: any) => state.auth?.entities?.refresh_token;
const tempTokenSelector = (state: any) => state.auth?.tempToken;
const langSelector = (state: any) => state.locales?.lang;

export { tokenSelector, tempTokenSelector, refreshTokenSelector, langSelector };
