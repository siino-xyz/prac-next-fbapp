import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-hooks-web";
import React from "react";

const searchClient = algoliasearch(
  "04D9OGIL14",
  "24e7509bfd9af533a10c5ffb9a41177c"
);

const Search = () => {
  return (
    <div>
      <h1>記事検索</h1>
    </div>
  );
};

export default Search;
