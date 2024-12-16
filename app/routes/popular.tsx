import type { Route } from "./+types/home";
import { Article, type ArticleJson } from "~/domain/Article";
import { motion } from "framer-motion";
import BlogCard from "~/components/BlogCard";

export async function loader({ params }: Route.LoaderArgs) {
  const res = await fetch(
    `https://qiita.com/api/v2/items?page=1&per_page=20&query=user%3ASicut_study`,
    {
      headers: {
        Authorization: `Bearer [あなたのトークン]`,
      },
    }
  );
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

export default function Popular({ loaderData }: Route.ComponentProps) {
  const { articles } = loaderData;
  return (
    <div>
      <div className="flex-1 sm:ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <h2 className="mb-6 text-3xl font-bold text-gray-800">
            人気記事一覧
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <BlogCard key={article.url} article={article} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
