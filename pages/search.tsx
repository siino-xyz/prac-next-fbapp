import algoliasearch from "algoliasearch/lite";
import {
  Configure,
  Hits,
  HitsProps,
  InstantSearch,
  Pagination,
  SearchBoxProps,
  useInstantSearch,
} from "react-instantsearch-hooks-web";
import { SearchBox } from "react-instantsearch-hooks-web";
import React, { ReactNode, useEffect, useState } from "react";
import { Post } from "../types/post";
import { debounce } from "debounce";
import { SearchIcon } from "@heroicons/react/outline/";
import { format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/client";
import { User } from "../types/user";

const searchClient = algoliasearch(
  "04D9OGIL14",
  "24e7509bfd9af533a10c5ffb9a41177c"
);

const Hit: HitsProps<Post>["hitComponent"] = ({ hit }) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const ref = doc(db, `users/${hit.authorId}`);
    getDoc(ref).then((snap) => {
      console.log("Fireastoreからデータ取ってきた");
      setUser(snap.data() as User);
    });
  }, [hit]);

  return (
    <div className="rounded-md shadow p-4">
      <h2>{hit.title}</h2>
      <p className="text-slate-500">
        {format(hit.createdAt, "yyyy年MM月dd日")}
      </p>
      {/* <p>
        {formatDistanceToNow(hit.createdAt, {
          locale: ja,
        })}
      </p> */}
      {user && <p>{user.name}</p>}
    </div>
  );
};

const NoResultsBoundary = ({ children }: { children: ReactNode }) => {
  const { results } = useInstantSearch();

  if (!results.__isArtificial && results.nbHits === 0) {
    return <p>「{results.query}」の検索結果はありませんでした。</p>;
  }

  return (
    <div>
      {results.query && (
        <p className="text-sm text-slate-500 my-4">
          「{results.query}」の検索結果が{results.nbHits}件見つかりました。
        </p>
      )}
      {children}
    </div>
  );
};

const Search = () => {
  const search: SearchBoxProps["queryHook"] = (query, hook) => {
    hook(query);
  };

  return (
    <div className="container">
      <h1>記事検索</h1>
      <InstantSearch indexName="posts" searchClient={searchClient}>
        <SearchBox
          classNames={{
            root: "relative inline-block",
            submitIcon: "hidden",
            resetIcon: "hidden",
            input: "rounded-full border-slate-300 pr-10",
          }}
          submitIconComponent={() => (
            <span className="absolute right-0 p-2 w-10 top-1/2 -translate-y-1/2 text-slate-500">
              <SearchIcon className="w-5 h-5" />
            </span>
          )}
          queryHook={debounce(search, 500)}
        />
        <Configure hitsPerPage={2} />
        <NoResultsBoundary>
          <Hits<Post>
            classNames={{
              list: "space-y-4 my-6",
            }}
            hitComponent={Hit}
          />
          <Pagination
            classNames={{
              list: "flex space-x-3",
              link: "py-1 px-3",
              disabledItem: "opacity-40",
              selectedItem: "text-blue-500",
            }}
          />
        </NoResultsBoundary>
      </InstantSearch>
    </div>
  );
};

export default Search;
