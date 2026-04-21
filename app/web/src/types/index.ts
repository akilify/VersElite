export interface Poem {
  id: string;
  author_id: string;
  title: string;
  content: string;
  type: "written" | "spoken_audio" | "spoken_video";
  media_url: string | null;
  thumbnail_url: string | null;
  is_premium: boolean;
  price: number;
  is_published: boolean;
  is_featured: boolean;
  like_count: number;
  view_count: number;
  created_at: string;
  profiles?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}
