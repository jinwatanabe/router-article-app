import { motion } from "framer-motion";
import { Heart, Bookmark } from "lucide-react";
import { Article } from "~/domain/Article";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface BlogCardProps {
  article: Article;
}

export default function BlogCard({ article }: BlogCardProps) {
  const formattedDate = format(
    new Date(article.published_at),
    "yyyy年MM月dd日",
    { locale: ja }
  );

  const randomId = Math.floor(Math.random() * 1000) + 1;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl"
    >
      <img
        src={`https://picsum.photos/seed/${randomId}/400/200`}
        alt="Blog post thumbnail"
        className="h-48 w-full object-cover"
      />
      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold text-gray-800 line-clamp-2">
          {article.title}
        </h3>
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <span>{formattedDate}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Heart className="mr-1 h-4 w-4 text-red-500" />
              <span>{article.like_count}</span>
            </div>
            <div className="flex items-center">
              <Bookmark className="mr-1 h-4 w-4 text-blue-500" />
              <span>{article.stocks_count}</span>
            </div>
          </div>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full bg-blue-500 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          続きを読む
        </a>
      </div>
    </motion.div>
  );
}
