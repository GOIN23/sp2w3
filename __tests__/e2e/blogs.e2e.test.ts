import { app } from "./../../src/app";
import { dbT } from "./../../src/db/mongo-.db";
import { body } from "express-validator";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { SETTINGS } from "../../src/seting/seting";
import { BlogViewModelT, PaginatorBlog } from "../../src/types/typeBlog";
import { PostViewModelT } from "../../src/types/typePosts";
import { ADMIN_AUTH } from "../../src/auth/authMiddleware";
import { testGet } from "../utilitTest/testGet";
import { managerTestBlogs } from "../utilitTest/managerTestBlogs";

let blogsTest: PaginatorBlog = { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] };
let blogPosts: PostViewModelT;
const buff2 = Buffer.from(ADMIN_AUTH, "utf8");
let codedAuth: string = buff2.toString("base64");

describe("checking endpoint on path /api/blog", () => {
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
  it("GET products = []", async () => {
    await request(app).get(SETTINGS.PATH.BLOGS).expect(blogsTest);
  });
  it("- POST unauthorized request ", async () => {
    await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .send({
        title: "aloig",
        shortDescription: "jn",
        content: "nnnn",
        blogId: "ytyy",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_401);
  });
  it("- POST failed request ", async () => {
    await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "",
        description: "string",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_400, {
        errorsMessages: [
          {
            message: "Invalid value",
            field: "name",
          },
        ],
      });

    await request(app).get(SETTINGS.PATH.BLOGS).expect(blogsTest);
  });
  it("- POST failed request absolut", async () => {
    await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "",
        description: "",
        websiteUrl: "://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_400, {
        errorsMessages: [
          {
            message: "Invalid value",
            field: "name",
          },
          {
            message: "Invalid value",
            field: "description",
          },
          {
            message: "Invalid value",
            field: "websiteUrl",
          },
        ],
      });
  });
  it("+ POST successful request to create a blog", async () => {
    await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    const resul = await request(app).get(SETTINGS.PATH.BLOGS);

    await request(app).get(SETTINGS.PATH.BLOGS).expect(resul.body);
  });
  it("+ GET product by ID with correct id", async () => {
    const blogs = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    await request(app).get(`${SETTINGS.PATH.BLOGS}/${blogs.id}`).expect(blogs);
  });
  it("+ POST creating a blog post", async () => {
    const blog: BlogViewModelT = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    const posts = await managerTestBlogs.creatBlogPostOne(
      {
        title: "ali",
        shortDescription: "jan",
        content: "dasdsq",
        blogId: blog.id,
      },
      blog.id
    );

    await request(app).get(`${SETTINGS.PATH.POSTS}/${posts.id}`).expect(posts);
  });
  it("+ GET get blog post", async () => {
    const blog: BlogViewModelT = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    const post = await managerTestBlogs.creatBlogPostOne(
      {
        title: "ali",
        shortDescription: "jan",
        content: "dasdsq",
        blogId: blog.id,
      },
      blog.id
    );

    await request(app)
      .get(`${SETTINGS.PATH.BLOGS}/${blog.id}/posts`)
      .expect({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [post] });
  });
  it("- PUT product by ID with incorrect data", async () => {
    await request(app)
      .put(`${SETTINGS.PATH.BLOGS}/` + 1223)
      .set({ Authorization: "Basic " + codedAuth })
      .send({ title: "title", author: "title" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_404);

    await request(app).get(SETTINGS.PATH.BLOGS).expect({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] });
  });
  it("+ PUT product by ID with correct data", async () => {
    const blog: BlogViewModelT = await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    })

    await managerTestBlogs.updateBlog(
      {
        name: "sadsad",
        description: "alo",
        websiteUrl: "https://AzjaYxsAsfCef-pmSQL8r4APHKA0jMx1435xE7iUl-3rhu0bNLJu88YAWsTeIaFEbUaw5rBoK_nukHlv15VtRjL1UXLp",
      },
      blog.id
    );

    const result = await request(app).get(SETTINGS.PATH.BLOGS);

    expect(result.body.items[0]).toEqual({
      ...blog,
      name: "sadsad",
      description: "alo",
      websiteUrl: "https://AzjaYxsAsfCef-pmSQL8r4APHKA0jMx1435xE7iUl-3rhu0bNLJu88YAWsTeIaFEbUaw5rBoK_nukHlv15VtRjL1UXLp",
    });
  });
  // tests query check!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  it("+ GET checking query - pageSize and pageNumber", async () => {
    await managerTestBlogs.creatBlogsMany();

    const resul = await request(app).get(SETTINGS.PATH.BLOGS);
    await request(app)
      .get(SETTINGS.PATH.BLOGS)
      .query({ pageSize: 1, pageNumber: 2 })
      .expect({
        pagesCount: 5,
        page: 2,
        pageSize: 1,
        totalCount: 5,
        items: [resul.body.items[1]],
      });

    await request(app)
      .get(SETTINGS.PATH.BLOGS)
      .query({ pageSize: 1, pageNumber: 3 })
      .expect({
        pagesCount: 5,
        page: 3,
        pageSize: 1,
        totalCount: 5,
        items: [resul.body.items[2]],
      });

    await request(app)
      .get(SETTINGS.PATH.BLOGS)
      .query({ pageSize: 2, pageNumber: 1 })
      .expect({
        pagesCount: 3,
        page: 1,
        pageSize: 2,
        totalCount: 5,
        items: [resul.body.items[0], resul.body.items[1]],
      });
  });
  it("+ GET checking query - sortDirection and sortBy", async () => {

    await managerTestBlogs.creatBlogsMany();

    const resul = await request(app).get(SETTINGS.PATH.BLOGS).query({ sortBy: "name" });

    await request(app)
      .get(SETTINGS.PATH.BLOGS)
      .query({ sortBy: "name" }) // Since the default value is desc, the sorting will be in descending order. It turns out from the last letter of the alphabet to the first
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 5,
        items: [...resul.body.items],
      });

    await request(app)
      .get(SETTINGS.PATH.BLOGS)
      .query({ sortBy: "name", sortDirection: "asc" })
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 5,
        items: [resul.body.items[4], resul.body.items[3], resul.body.items[2], resul.body.items[1], resul.body.items[0]],
      });
  });

  it("+ GET checking query - searchNameTerm", async () => {
    await managerTestBlogs.creatBlogsMany();

    const resul = await request(app).get(SETTINGS.PATH.BLOGS).query({ sortBy: "name" });

    console.log(resul.body)

    await request(app)
      .get(SETTINGS.PATH.BLOGS)
      .query({ searchNameTerm: "ctri" })
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [resul.body.items[2]],
      });
  });

  it("- DELETE product by incorrect ID", async () => {
    await request(app)
      .delete(`${SETTINGS.PATH.BLOGS}/876328`)
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_404);

    const res = await request(app).get(SETTINGS.PATH.BLOGS);
    expect(res.body).toEqual(blogsTest);
  });
  it("+ DELETE product by ID", async () => {
   const blog =  await managerTestBlogs.creatBlogOne({
      name: "string",
      description: "string",
      websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
    });

    await request(app)
      .delete(`${SETTINGS.PATH.BLOGS}/${blog.id}`)
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_204);

    const res = await request(app).get(SETTINGS.PATH.BLOGS);

    expect(res.body).toEqual({ pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [...res.body.items] });
  });
});
