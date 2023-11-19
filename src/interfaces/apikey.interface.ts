export interface ApiKey {
  _id?: string;
  key: string;
  status: boolean;
  permissions: string[];
}
