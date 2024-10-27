export interface AuthStateType {
    accessToken: string;
    refreshToken: string;
    setAccessToken: (token: string) => Promise<void>;
    setRefreshToken: (token: string) => Promise<void>;
    removeTokens: () => Promise<void>;
    isLoggedIn: () => Promise<boolean>;
}
