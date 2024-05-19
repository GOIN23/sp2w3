import { app } from "../../src/app";
import request from "supertest";
import { ADMIN_AUTH } from "../../src/auth/authMiddleware";
import { SETTINGS } from "../../src/seting/seting";
import { PaginatorPosts, PostInputModelT, PostViewModelT } from "../../src/types/typePosts";
import { CommentViewModel } from "../../src/types/typeCommen";


const buff2 = Buffer.from(ADMIN_AUTH, "utf8");
const codedAuth: string = buff2.toString("base64");

export const managerTestPosts = {
  async creatPostOne(sendInput: PostInputModelT): Promise<PostViewModelT> {
    const post = await request(app)
      .post(SETTINGS.PATH.POSTS)
      .set({ Authorization: "Basic " + codedAuth })
      .send(sendInput)
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);

    return post.body;
  },
  async creatPostMany(blogId: string): Promise<PaginatorPosts> {
    await request(app)
      .post(SETTINGS.PATH.POSTS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "Ali",
        shortDescription: "jan",
        content: "dasdsq",
        blogId: blogId,
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);

    await request(app)
      .post(SETTINGS.PATH.POSTS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "ali",
        shortDescription: "jan",
        content: "dasdsq",
        blogId: blogId,
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);

    await request(app)
      .post(SETTINGS.PATH.POSTS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "bli2",
        shortDescription: "jan3",
        content: "dasdsq",
        blogId: blogId,
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);
    await request(app)
      .post(SETTINGS.PATH.POSTS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "cli",
        shortDescription: "jan",
        content: "dasdsq",
        blogId: blogId,
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);
    await request(app)
      .post(SETTINGS.PATH.POSTS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "dli",
        shortDescription: "jan",
        content: "dasdsq",
        blogId: blogId,
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);

    const resulv = await request(app).get(SETTINGS.PATH.POSTS);

    return resulv.body;
  },
  async creatCommentPostOne(token: string, postId: string): Promise<CommentViewModel> {
    const commentPost = await request(app)
      .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
      .set({ Authorization: "Bearer " + token })
      .send({ content: "adasds dasdas adas dad a" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);
    return commentPost.body
  }
};
