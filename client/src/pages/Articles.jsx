import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Search, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { endpoint } from "../api";
import axios from "axios"
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [category, setCategory] = useState("All")
  const navigate = useNavigate()

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    }, 400)

    return () => clearTimeout(timer)
  }, [search])

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [category])

  // Fetch Articles
  const fetchArticles = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()

      params.append("page", currentPage)
      params.append("limit", 9)

      if (debouncedSearch.trim()) {
        params.append("search", debouncedSearch)
      }

      if (category !== "All") {
        params.append("category", category)
      }

      const response = await axios.get(
        `${endpoint}/article/articles?${params.toString()}`
      )
      // console.log("Fetched Articles:", response.data.articles)

      setArticles(response.data.articles)
      setTotalPages(response.data.totalPages)

    } catch (error) {
      console.error(error)
      alert("Failed to fetch articles.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch effect
  useEffect(() => {
    fetchArticles()
  }, [currentPage, debouncedSearch, category])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">

        {/* HEADER */}
        <header className="flex flex-col items-center text-center mb-8 sm:mb-10 lg:mb-12">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-3 sm:mb-4">
            Articles
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mb-6 sm:mb-8 px-2">
            Insights on AI systems, data engineering, and machine learning infrastructure.
          </p>

          {/* SEARCH */}
          <div className="w-full max-w-md relative px-2 sm:px-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-lg sm:text-xl">
                <Search />
              </span>
            </div>

            <input
              className="block w-full pl-10 pr-4 py-3 sm:py-3.5 border border-slate-200 rounded-md bg-white
                       focus:ring-2 focus:ring-primary-focus focus:border-transparent outline-none
                       transition text-sm sm:text-base"
              placeholder="Search articles..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* FILTERS */}
        <nav className="flex flex-wrap justify-start sm:justify-center gap-2 sm:gap-3 mb-10 sm:mb-12 overflow-x-auto scrollbar-hide pb-2">
          {[
            "All",
            "Docker",
            "Artificial Intelligence",
            "Data Engineering",
            "Machine Learning Systems",
            "MLOps",
            "Research",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors
              ${category === item
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {item === "Artificial Intelligence" ? "AI" : item}
            </button>
          ))}
        </nav>

        {/* ARTICLES GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14 sm:mb-16">

          {loading ? (
            Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col bg-white rounded-lg overflow-hidden border border-slate-200 animate-pulse"
              >
                {/* Image Skeleton */}
                <div className="aspect-video w-full bg-slate-200"></div>

                {/* Content Skeleton */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow">

                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-5 w-20 rounded-full bg-slate-200"></div>
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  </div>

                  <div className="h-6 w-full bg-slate-200 rounded mb-2"></div>
                  <div className="h-6 w-3/4 bg-slate-200 rounded mb-4"></div>

                  <div className="space-y-2 mb-6">
                    <div className="h-4 w-full bg-slate-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                    <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="h-4 w-28 bg-slate-200 rounded"></div>
                  </div>

                </div>
              </div>
            ))
          ) : articles.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">

              <div className="relative w-28 h-28 sm:w-40 sm:h-40 mb-6">
                <div className="absolute inset-0 bg-emerald-200/40 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute inset-6 bg-emerald-300/60 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute inset-12 bg-emerald-500/20 rounded-full"></div>
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                No articles found
              </h3>

              <p className="text-sm sm:text-base text-slate-500 max-w-md">
                We couldn’t find anything matching your search. Try a different keyword or category.
              </p>
            </div>
          ) : (
            articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/article/${article.id}`}
                className="group block"
              >
                <article className="h-full flex flex-col bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-sm transition-shadow">

                  {/* IMAGE */}
                  <div className="aspect-video w-full bg-slate-200 relative overflow-hidden">
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">

                    {/* CATEGORY + DATE */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-lime-100 text-accent-badge uppercase tracking-wider">
                        {article.category}
                      </span>

                      <span className="text-xs text-slate-500">
                        {new Date(article.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3
                      className=" text-base sm:text-lg font-bold text-slate-900
                                  mb-2 leading-tight group-hover:text-primary
                                  transition-colors line-clamp-2 min-h-[3.5rem]"
                    >
                      {article.title}
                    </h3>

                    <p className=" text-slate-600 text-sm mb-4 line-clamp-3 min-h-[4.5rem]">
                      {article.excerpt}
                    </p>

                    {/* CTA */}
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <span className="text-primary font-semibold text-sm inline-flex items-center hover:underline">
                        Read article
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>

                  </div>
                </article>
              </Link>
            ))
          )}

        </section>

        {/* PAGINATION */}
        <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-16 sm:mb-20">

          {/* Prev */}
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className={`px-3 sm:px-4 py-2 border rounded-lg text-xs sm:text-sm font-medium transition-colors
            ${currentPage === 1
                ? "text-slate-300 cursor-not-allowed bg-white border-slate-200"
                : "text-slate-600 bg-white hover:bg-slate-50 border-slate-200"
              }`}
          >
            <ChevronLeft className="w-4 h-4 inline mr-1" />
            Prev
          </button>

          {/* Numbers */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-colors
                ${currentPage === i + 1
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 sm:px-4 py-2 border rounded-lg text-xs sm:text-sm font-medium transition-colors
            ${currentPage === totalPages
                ? "text-slate-300 cursor-not-allowed bg-white border-slate-200"
                : "text-slate-600 bg-white hover:bg-slate-50 border-slate-200"
              }`}
          >
            Next
            <ChevronRight className="w-4 h-4 inline ml-1" />
          </button>

        </nav>

      </main>

      <Footer />
    </div>
  )
}

export default Articles