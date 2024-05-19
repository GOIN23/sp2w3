import { MongoMemoryServer } from "mongodb-memory-server";
import { dbT } from "../../src/db/mongo-.db";
import request from "supertest";
import { app } from "../../src/app";
import { SETTINGS } from "../../src/seting/seting";
import { managerTestBlogs } from "../utilitTest/managerTestBlogs";
import { managerTestPosts } from "../utilitTest/managerTestPosts";
import { managerTestUser } from "../utilitTest/managerTestUser";





describe("checking endpoint on path /api/comments", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await dbT.run(mongoServer.getUri());
    });
    afterAll(async () => {
        await dbT.stop();
    });
    afterEach(async () => {
        await dbT.drop();
    })

    it("- GET products", async () => {
        await request(app).get(`${SETTINGS.PATH.COMMENTES}/2312`).expect(SETTINGS.HTTPCOD.HTTPCOD_404);
    })
    it("+ GET products", async () => {
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


        await request(app).get(`${SETTINGS.PATH.COMMENTES}/${postComment.id}`).expect(postComment);
    });
    it("- PUT Unauthorized", async () => {
        await request(app)
            .put(`${SETTINGS.PATH.COMMENTES}/2312`)
            .send({ content: "stringstringstringst" })
            .expect(SETTINGS.HTTPCOD.HTTPCOD_401);
    })
    it("- PUT not found", async () => {
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


        await request(app)
            .put(`${SETTINGS.PATH.COMMENTES}/2312`)
            .set({ Authorization: "Bearer " + token.body.accessToken })
            .send({ content: "stringstringstringst" })
            .expect(SETTINGS.HTTPCOD.HTTPCOD_404);
    })
    it("+ PUT successful request", async () => {
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
        await request(app)
            .put(`${SETTINGS.PATH.COMMENTES}/${postComment.id}`)
            .set({ Authorization: "Bearer " + token.body.accessToken })
            .send({ content: "stringstringstringst" })
            .expect(SETTINGS.HTTPCOD.HTTPCOD_204);
    })
    it("- DELETE not found", async () => {
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

        await request(app)
            .delete(`${SETTINGS.PATH.COMMENTES}/2312`)
            .set({ Authorization: "Bearer " + token.body.accessToken })
            .expect(SETTINGS.HTTPCOD.HTTPCOD_404);
    })
    it("- DELETE Unauthorized", async () => {
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

        await request(app)
            .delete(`${SETTINGS.PATH.COMMENTES}/${postComment.id}`)
            .expect(SETTINGS.HTTPCOD.HTTPCOD_401);
    })
    it("+ DELETE successful request in id", async () => {
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

        await request(app)
            .delete(`${SETTINGS.PATH.COMMENTES}/${postComment.id}`)
            .set({ Authorization: "Bearer " + token.body.accessToken })
            .expect(SETTINGS.HTTPCOD.HTTPCOD_204);
    })

})