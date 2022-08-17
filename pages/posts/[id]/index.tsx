import { format } from "date-fns";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { adminDB } from "../../../firebase/server";
import { useUser } from "../../../lib/user";
import { Post } from "../../../types/post";

export const getStaticProps: GetStaticProps<{ post: Post }> = async (
  context
) => {
  const snap = await adminDB.doc(`posts/${context.params?.id}`).get();
  const post = snap.data() as Post;
  return {
    props: {
      post,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const PostDetailPage = ({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const user = useUser(post?.authorId);
  console.log(user);

  if (!post) {
    return <p>記事が存在しません</p>;
  }

  return (
    <div className="container">
      <p>
        <Link href="/search">
          <a>Top</a>
        </Link>
      </p>
      <div className="aspect-video rounded-md bg-slate-200 mb-4"></div>
      <h1 className="mb-2 font-bold text-lg">{post.title}</h1>
      {user && (
        <div className="flex mb-4">
          <div className="w-10 h-10 mr-2 bg-slate-400 rounded-full"></div>
          <div className="flex-1">
            <p>{user.name}</p>
            <p className="text-slate-500">
              {format(post.createdAt, "yyyy年MM月dd日")}
            </p>
          </div>
        </div>
      )}

      <p>{post.body}</p>
    </div>
  );
};

export default PostDetailPage;
