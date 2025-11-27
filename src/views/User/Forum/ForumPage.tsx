"use client";

import { useMemo, useState } from "react";
import { useContent } from "@/hooks";
import ForumHeader from "./ForumHeader";
import ForumSearchFilter from "./ForumSearchFilter";
import ForumRefreshButton from "./ForumRefreshButton";
import ForumArticleCard from "./ForumArticleCard";
import ForumEmptyState from "./ForumEmptyState";
import ForumLoadingState from "./ForumLoadingState";
import ForumErrorState from "./ForumErrorState";

const ForumPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const {
    articles,
    isLoading,
    error,
    refetch: fetchArticles,
  } = useContent();

  const filteredArticles = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      const matchSearch =
        !keyword ||
        article.title.toLowerCase().includes(keyword) ||
        article.content.toLowerCase().includes(keyword);
      const matchCategory =
        selectedCategory === "Semua" || article.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 lg:p-8 pt-16 md:pt-4">
      <div className="mx-auto max-w-7xl">
        <ForumHeader />

        <ForumSearchFilter
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
        />

        <ForumRefreshButton
          isLoading={isLoading}
          onRefresh={() => fetchArticles(true)}
        />

        {error && !isLoading && <ForumErrorState error={error} />}

        {isLoading ? (
          <ForumLoadingState />
        ) : filteredArticles.length === 0 ? (
          <ForumEmptyState hasArticles={articles.length > 0} />
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article, index) => (
              <ForumArticleCard
                key={article.id}
                article={article}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
