export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string | null;
  location: string | null;
  avatarUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  xUrl: string | null;
  updatedAt: string;
}

export type ProfileRequest = Omit<Profile, 'id' | 'updatedAt'>;
