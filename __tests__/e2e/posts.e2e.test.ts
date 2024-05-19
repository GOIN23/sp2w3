import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ADMIN_AUTH } from "../../src/auth/authMiddleware";
import { dbT } from "../../src/db/mongo-.db";
import { app } from "../../src/app";
import { SETTINGS } from "../../src/seting/seting";
import { PaginatorBlog } from "../../src/types/typeBlog";
import { PaginatorPosts } from "../../src/types/typePosts";
import { managerTestBlogs } from "../utilitTest/managerTestBlogs";
import { managerTestPosts } from "../utilitTest/managerTestPosts";
import { managerTestUser } from "../utilitTest/managerTestUser";




const postsTestIdTest: PaginatorPosts = { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] };
const buff2 = Buffer.from(ADMIN_AUTH, "utf8");
const codedAuth: string = buff2.toString("base64");

describe("checking endpoint on path /api/post", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await dbT.run(mongoServer.getUri());
  });
  afterAll(async () => {
    await dbT.stop();
  });
  afterEach(async () => {
    await dbT.drop();
  });
  it("+ GET products = []", async () => {
    await request(app).get(SETTINGS.PATH.POSTS).expect(postsTestIdTest);
  });

  it("- POST unauthorized request ", async () => {
    await request(app)
      .post(SETTINGS.PATH.POSTS)
      .send({
        title: "aloig",
        shortDescription: "jn",
        content: "nnnn",
        blogId: "ytyy",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_401);
  });

  it("- POST  failed request body blogId", async () => {
    await request(app)
      .post(SETTINGS.PATH.POSTS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "aloig",
        shortDescription: "jn",
        content: "nnnn",
        blogId: "ytyy",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_400, {
        errorsMessages: [
          {
            message: "E-mail already in use",
            field: "blogId",
          },
        ],
      });

    await request(app).get(SETTINGS.PATH.POSTS).expect(postsTestIdTest);
  });

  it("- POST failed request", async () => {
    await request(app)
      .post(SETTINGS.PATH.POSTS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "",
        shortDescription: "",
        content: "",
        blogId: "",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_400, {
        errorsMessages: [
          {
            message: "Invalid value",
            field: "title",
          },

          {
            message: "Invalid value",
            field: "shortDescription",
          },
          {
            message: "Invalid value",
            field: "content",
          },
          {
            message: "Invalid value",
            field: "blogId",
          },
        ],
      });

    await request(app).get(SETTINGS.PATH.POSTS).expect(postsTestIdTest);
  });

  it("+ POST successful request to create a post  ", async () => {
    const blog = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    await managerTestPosts.creatPostOne({
      blogId: blog.id,
      title: "saday",
      shortDescription: "jan",
      content: "blas asdsa",
    });

    const result = await request(app).get(SETTINGS.PATH.POSTS);

    await request(app).get(SETTINGS.PATH.POSTS).expect(result.body);
  });

  it("+ GET product by ID with correct id", async () => {
    const blog = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    const post = await managerTestPosts.creatPostOne({
      blogId: blog.id,
      title: "saday",
      shortDescription: "jan",
      content: "blas asdsa",
    });

    await request(app).get(`${SETTINGS.PATH.POSTS}/${post.id}`).expect(post);
  });

  it("- PUT product by ID with incorrect data", async () => {
    await request(app)
      .put(`${SETTINGS.PATH.POSTS}/123`)
      .set({ Authorization: "Basic " + codedAuth })
      .send({ title: "title", author: "title" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_404);

    await request(app).get(SETTINGS.PATH.POSTS).expect({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
  });

  it("+ PUT product by ID with correct data", async () => {
    const blog = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    const posts = await managerTestPosts.creatPostOne({
      blogId: blog.id,
      title: "saday",
      shortDescription: "jan",
      content: "blas asdsa",
    });

    const res = await request(app).get(SETTINGS.PATH.POSTS);

    expect(res.body).toEqual({ ...postsTestIdTest, pagesCount: 1, totalCount: 1, items: [posts] });
  });

  // tests query check!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  it("+ GET checking query - pageSize and pageNumber ", async () => {
    const blog = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    const result = await managerTestPosts.creatPostMany(blog.id);


    await request(app)
      .get(SETTINGS.PATH.POSTS)
      .query({ pageSize: 1, pageNumber: 2 })
      .expect({
        pagesCount: 5,
        page: 2,
        pageSize: 1,
        totalCount: 5,
        items: [result.items[1]],
      });

    await request(app)
      .get(SETTINGS.PATH.POSTS)
      .query({ pageSize: 1, pageNumber: 3 })
      .expect({
        pagesCount: 5,
        page: 3,
        pageSize: 1,
        totalCount: 5,
        items: [result.items[2]],
      });

    await request(app)
      .get(SETTINGS.PATH.POSTS)
      .query({ pageSize: 2, pageNumber: 1 })
      .expect({
        pagesCount: 3,
        page: 1,
        pageSize: 2,
        totalCount: 5,
        items: [result.items[0], result.items[1]],
      });
  });

  it("+ GET checking query - sortDirection and sortBy", async () => {
    const blog = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    const result = await managerTestPosts.creatPostMany(blog.id);

    await request(app)
      .get(SETTINGS.PATH.POSTS)
      .query({ sortBy: "title" }) // Since the default value is desc, the sorting will be in descending order. It turns out from the last letter of the alphabet to the first
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 5,
        items: [...result.items],
      });

    await request(app)
      .get(SETTINGS.PATH.POSTS)
      .query({ sortBy: "title", sortDirection: "asc" })
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 5,
        items: [result.items[4], result.items[3], result.items[2], result.items[1], result.items[0]],
      });
  });

  it("- PUT product by ID with incorrect data", async () => {
    await request(app)
      .put(`${SETTINGS.PATH.POSTS}/12312`)
      .set({ Authorization: "Basic " + codedAuth })
      .send({ title: "title", author: "title" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_404);

    const res = await request(app).get(SETTINGS.PATH.POSTS);
    expect(res.body).toEqual(postsTestIdTest);
  });

  //tests comments !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  it("- POSTS/:ID/COMMENTS. METHOD=POST invalid jwt token. Unauthorized", async () => {
    const blog = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    const post = await managerTestPosts.creatPostOne({
      blogId: blog.id,
      title: "saday",
      shortDescription: "jan",
      content: "blas asdsa",
    });

    await request(app)
      .post(`${SETTINGS.PATH.POSTS}/${post.id}/comments`)
      .set({ Authorization: "Basic " + codedAuth })
      .send({ content: "adasdas dasdas adas dad a" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_401);
  });

  it("+ POSTS/:ID/COMMENTS METHOD=POST successful request creating comments", async () => {
    const user = await managerTestUser.registerUser({
      email: "4e5.kn@mail.ru",
      login: "fsasasfas",
      password: "string",
    });
    const token = await request(app)
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send({
        loginOrEmail: "4e5.kn@mail.ru", password: "string",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_200);

    const blog = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    const posts = await managerTestPosts.creatPostOne({
      blogId: blog.id,
      title: "saday",
      shortDescription: "jan",
      content: "blas asdsa",
    });


    const postComment = await managerTestPosts.creatCommentPostOne(token.body.accessToken, posts.id)
    expect(postComment).toEqual({
      id: expect.any(String),
      commentatorInfo: { userId: expect.any(String), userLogin: "fsasasfas" },
      content: "adasds dasdas adas dad a",
      createdAt: expect.any(String),
    });
  });

  it(" + POSTS/:ID/COMMENTS METHOD=GET check comment for receiving data", async () => {
    const user = await managerTestUser.registerUser({
      email: "4e5.kn@mail.ru",
      login: "fsasasfas",
      password: "string",
    });
    const token = await request(app)
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .send({
        loginOrEmail: "4e5.kn@mail.ru", password: "string",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_200);

    const blog = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    const posts = await managerTestPosts.creatPostOne({
      blogId: blog.id,
      title: "saday",
      shortDescription: "jan",
      content: "blas asdsa",
    });


    const postComment = await managerTestPosts.creatCommentPostOne(token.body.accessToken, posts.id)

    const comments = await request(app)
      .get(`${SETTINGS.PATH.POSTS}/${posts.id}/comments`)
      .set({ Authorization: "Bearer " + token.body.accessToken })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_200);

    expect(comments.body).toEqual({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [postComment] });
  });

  it("- DELETE product by incorrect ID", async () => {
    await request(app)
      .delete(`${SETTINGS.PATH.POSTS}/3232`)
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_404);

    const res = await request(app).get("/api/posts/");
    expect(res.body).toEqual(postsTestIdTest);
  });

  it("+ DELETE product by ID", async () => {
    
    const blog = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    const posts = await managerTestPosts.creatPostOne({
      blogId: blog.id,
      title: "saday",
      shortDescription: "jan",
      content: "blas asdsa",
    });

    await request(app)
      .delete(`${SETTINGS.PATH.POSTS}/${posts.id}`)
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_204);

    const res = await request(app).get(SETTINGS.PATH.POSTS);
    expect(res.body).toEqual(postsTestIdTest);
  });
});
