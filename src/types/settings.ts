export interface UserSettings {
  id: string;
  name: string;
  email: string;
  username: string;
  displayPicture: string | null;
  banner: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsRequest {
  name?: string;
  username?: string;
  password?: string;
}

export interface SettingsResponse {
  user: UserSettings;
}

export interface UpdateSettingsResponse {
  message: string;
  user: UserSettings;
}

export interface UploadImageResponse {
  message: string;
  displayPicture?: string;
  banner?: string;
}