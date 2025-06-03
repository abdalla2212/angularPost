export interface Post {
  id: string;
  userName: string;
  userImage: string;
  title: string;
  postDescription: string;
  postImage: string;
  createdAt: string;
  isLiked: boolean;
  comments: string[];
}
