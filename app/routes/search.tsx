import { Article, type ArticleJson } from "~/domain/Article";
import type { Route } from "../routes/+types/search";
import { useFetcher, useLoaderData } from "react-router";
import { useRef } from "react";
import BlogCardWithFavorite from "~/components/BlogCardWithFavorite";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";

async function fetchArticles(keywords?: string) {
  const query = keywords
    ? `user:Sicut_study+title:${keywords}`
    : "user:Sicut_study";
  const res = await fetch(
    `https://qiita.com/api/v2/items?page=1&per_page=20&query=${query}`,
    {
      headers: {
        Authorization: `Bearer [あなたのトークン]`,
      },
    }
  );
  return res;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action === "search") {
    const keywords = formData.get("keywords");
    const res = await fetchArticles(keywords?.toString());
    const articlesJson: ArticleJson[] = await res.json();
    const articles = articlesJson.map(
      (articleJson) =>
        new Article(
          articleJson.title,
          articleJson.url,
          articleJson.likes_count,
          articleJson.stocks_count,
          articleJson.created_at
        )
    );

    return { articles };
  }

  if (_action === "like") {
    const title = formData.get("title");
    console.log(title);
    return null;
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const res = await fetchArticles();
  const articlesJson: ArticleJson[] = await res.json();
  const articles = articlesJson.map(
    (articleJson) =>
      new Article(
        articleJson.title,
        articleJson.url,
        articleJson.likes_count,
        articleJson.stocks_count,
        articleJson.created_at
      )
  );
  return { articles };
}

export default function Search() {
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher<{ articles: Article[] }>();
  const loader = useLoaderData<{ articles: Article[] }>();
  const articles = fetcher.data?.articles || loader.articles;

  return (
    <div className="flex-1 sm:ml-64">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <h2 className="mb-6 text-3xl font-bold text-gray-800">記事を検索</h2>
        <fetcher.Form method="post" ref={formRef} className="mb-8 flex">
          <input
            type="text"
            name="keywords"
            placeholder="キーワードを入力..."
            className="flex-grow rounded-l-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            name="_action"
            value="search"
            className="flex items-center rounded-r-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            <SearchIcon className="mr-2 h-5 w-5" />
            検索
          </button>
        </fetcher.Form>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <fetcher.Form method="post" key={article.url}>
              <BlogCardWithFavorite article={article} />
            </fetcher.Form>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
