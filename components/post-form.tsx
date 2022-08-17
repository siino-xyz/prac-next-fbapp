import classNames from "classnames";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/button";
import { useAuth } from "../context/auth";
import { db } from "../firebase/client";
import { Post } from "../types/post";

const PostForm = ({ isEditMode }: { isEditMode: boolean }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Post>();

  const { fbUser, isLoading } = useAuth();
  const router = useRouter();
  const editTargetId = router.query.id as string;

  useEffect(() => {
    if (editTargetId) {
      const ref = doc(db, `posts/${editTargetId}`);
      getDoc(ref).then((snap) => {
        const oldPost = snap.data() as Post;
        reset(oldPost);
      });
    }
  }, [editTargetId]);

  if (!fbUser) {
    if (!isLoading) {
      router.push("/login");
    }
    return null;
  }

  const submit = (data: Post) => {
    const ref = isEditMode
      ? doc(db, `posts/${editTargetId}`)
      : doc(collection(db, "posts"));
    const post: Post = {
      id: isEditMode ? editTargetId : ref.id,
      title: data.title,
      body: data.body,
      createdAt: Date.now(),
      updatedAt: null,
      authorId: fbUser.uid,
    };

    setDoc(ref, post).then(() => {
      alert(`記事を${isEditMode ? "更新" : "作成"}しました`);
    });
  };

  return (
    <div>
      <h1>記事{isEditMode ? "編集" : "投稿"}</h1>
      <form onSubmit={handleSubmit(submit)}>
        <div>
          <label className="block mb-0.5" htmlFor="name">
            タイトル*
          </label>
          <input
            className={classNames(
              "rounded border",
              errors.title ? "border-red-500" : "border-slate-300"
            )}
            autoComplete="name"
            {...register("title", {
              required: "必須入力です",
              maxLength: {
                value: 100,
                message: "最大100文字です",
              },
            })}
            id="title"
            type="text"
          />
          {errors.title && (
            <p className="text-red-500 mt-0.5">{errors.title?.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-0.5" htmlFor="name">
            本文*
          </label>
          <textarea
            className={classNames(
              "rounded border",
              errors.body ? "border-red-500" : "border-slate-300"
            )}
            {...register("body", {
              required: "必須入力です",
              maxLength: {
                value: 400,
                message: "最大400文字です",
              },
            })}
            id="body"
          />
          {errors.body && (
            <p className="text-red-500 mt-0.5">{errors.body?.message}</p>
          )}
        </div>
        <Button>投稿{isEditMode ? "保存" : "投稿"}</Button>
      </form>
    </div>
  );
};

export default PostForm;
