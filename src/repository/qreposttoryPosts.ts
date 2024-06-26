import { dbT } from "../db/mongo-.db";
import { BlogViewModelT, PaginatorBlog } from "../types/typeBlog";
import { PaginatorPosts, PostViewModelT, PostViewModelTdb } from "../types/typePosts";

export const qreposttoryPosts = {
  async getPosts(query: any): Promise<PaginatorPosts | { error: string }> {
    const search = query.searchNameTerm ? { title: { $regex: query.searchNameTerm, $options: "i" } } : {};
    const filter = {
      ...search,
    };
    try {
      const items: PostViewModelTdb[] = (await dbT
        .getCollections()
        .postCollection.find({})
        .sort(query.sortBy, query.sortDirection)
        .skip((+query.pageNumber - 1) * +query.pageSize)
        .limit(+query.pageSize)
        .toArray()) ;

      const totalCount = await dbT.getCollections().postCollection.countDocuments(filter);

      const mapPosts: PostViewModelT[] = items.map((post: PostViewModelTdb) => {
        return {
          id: post._id,
          blogId: post.blogId,
          blogName: post.blogName,
          content: post.content,
          createdAt: post.createdAt,
          shortDescription: post.shortDescription,
          title: post.title,
        };
      });

      return {
        pagesCount: Math.ceil(totalCount / +query.pageSize),
        page: +query.pageNumber,
        pageSize: +query.pageSize,
        totalCount,
        items: mapPosts,
      };
    } catch (e) {
      console.log(e);
      return { error: "some error" };
    }
  },
};
