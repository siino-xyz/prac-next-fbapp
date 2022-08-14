import classNames from "classnames";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "../components/button";
import { useAuth } from "../context/auth";
import { User } from "../types/user";

const CreateAccount = () => {
  const { isLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<User>();

  if (isLoading) {
    return true;
  }

  if (!isLoggedIn) {
    router.push("/login");
    return null;
  }

  const submit = (data: User) => {
    console.log(data);
  };

  return (
    <div className="container">
      <h1>アカウント作成</h1>
      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        <div>
          <label className="block mb-0.5" htmlFor="name">
            名前*
          </label>
          <input
            className={classNames(
              "rounded border",
              errors.name ? "border-red-500" : "border-slate-300"
            )}
            autoComplete="name"
            {...register("name", {
              required: "必須入力です",
              maxLength: {
                value: 50,
                message: "最大50文字です",
              },
            })}
            id="name"
            name="name"
            type="text"
          />
          {errors.name && (
            <p className="text-red-500 mt-0.5">{errors.name?.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-0.5" htmlFor="nickname">
            ニックネーム*
          </label>
          <input
            className={classNames(
              "rounded border",
              errors.name ? "border-red-500" : "border-slate-300"
            )}
            autoComplete="off"
            {...register("nickname", {
              required: "必須入力です",
              maxLength: {
                value: 50,
                message: "最大50文字です",
              },
            })}
            id="nickname"
            name="nickname"
            type="text"
          />
          {errors.nickname && (
            <p className="text-red-500 mt-0.5">{errors.nickname?.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-0.5" htmlFor="profile">
            プロフィール*
          </label>
          <textarea
            className={classNames(
              "rounded border",
              errors.name ? "border-red-500" : "border-slate-300"
            )}
            {...register("profile", {
              required: "必須入力です",
              maxLength: {
                value: 255,
                message: "最大255文字です",
              },
            })}
            id="profile"
            name="profile"
          />
          <p className="text-sm text-slate-400 leading-none">
            {watch("profile")?.length || 0}/255
          </p>
          {errors.profile && (
            <p className="text-red-500 mt-0.5">{errors.profile?.message}</p>
          )}
        </div>
        <Button>アカウント作成</Button>
      </form>
    </div>
  );
};

export default CreateAccount;
