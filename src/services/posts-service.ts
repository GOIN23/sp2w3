import { ObjectId } from "mongodb";
import { repositoryPosts } from "../repository/repositoryPosts";
import { CommentInputModel, CommentViewModel, CommentViewModelDb } from "../types/typeCommen";
import { PostInputModelT, PostViewModelT, PostViewModelTdb } from "../types/typePosts";
import { generateRandomString } from "../utilt/randomText";
import { UserViewModel } from "../types/typeUser";

export const postsService = {
  async creatPosts(body: PostInputModelT, id?: string): Promise<PostViewModelT | null> {
    const newPosts: PostViewModelTdb = {
      _id: String(new ObjectId()),
      title: body.title,
      shortDescription: body.shortDescription,
      blogId: body.blogId,
      blogName: generateRandomString(2),
      content: body.content,
      createdAt: new Date().toISOString(),
    };

    if (id) {
      newPosts.blogId = id;
    }

    await repositoryPosts.creatPosts(newPosts);

    const newFindPost = await this.findPosts(newPosts._id);

    return newFindPost;
  },

  async createCommentPost(body: CommentInputModel, user: UserViewModel, IdPost: string): Promise<CommentViewModel | null> {
    const newCommentPosts: CommentViewModelDb = {
      _id: String(new ObjectId()),
      content: body.content,
      commentatorInfo: {
        userId: user._id,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
      IdPost,
    };

    await repositoryPosts.createCommentPost(newCommentPosts);

    const newFindCommentPost = await this.findCommentPosts(newCommentPosts._id);

    return newFindCommentPost;
  },

  async findCommentPosts(id: string): Promise<CommentViewModel | null> {
    const resul = await repositoryPosts.findCommentPosts(id);

    return resul;
  },
  async updateCommentPosts(body: CommentInputModel, id: string): Promise<void> {
    await repositoryPosts.updatCommentPosts(body, id);
  },
  async findPosts(id: string): Promise<PostViewModelT | null> {
    return await repositoryPosts.findPosts(id);
  },

  async updatPosts(body: PostInputModelT, id: string): Promise<void> {
    await repositoryPosts.updatPosts(body, id);
  },

  async deleteCommentPosts(id: string): Promise<void> {
    await repositoryPosts.deleteCommentPosts(id);
  },
  async deletePosts(id: string): Promise<void> {
    await repositoryPosts.deletePosts(id);
  },
};
