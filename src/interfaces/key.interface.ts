export interface Key {
  _id?: string;
  user: string;
  publicKey: string;
  refreshToken: string;
  refreshTokenUsed: string[];
}
