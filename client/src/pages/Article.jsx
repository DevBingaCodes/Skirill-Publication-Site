import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { AtSign, Clock4, Link, Share2, ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { endpoint } from "../api";
import axios from "axios";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";

function Article() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [article, setArticle] = useState(null)
    const [relatedArticles, setRelatedArticles] = useState([])

    //Article Sharing
    const articleUrl = window.location.href

    //Clipboard Copy Mechanism
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            alert("Link copied to clipboard!")
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }


    //Single Article useEffect
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`${endpoint}/article/public/article/${id}`)
                // console.log(response.data)
                setArticle(response.data.article)
                setRelatedArticles(response.data.relatedArticles)
            } catch (error) {
                console.log(error)
                console.error("Error fetching article:", error);
                alert("Error fetching article.")
            }
        }
        fetchArticle()
    }, [id])


    //Share Native
    const shareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.excerpt || "Check out this article",
                    url: window.location.href,
                })
            } catch (err) {
                console.error("Share cancelled or failed:", err)
            }
        } else {
            copyToClipboard()
        }
    }

    // Loading State
    if (!article) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light text-slate-900 font-display" aria-busy="true">
                <Navbar />

                <main className="flex-grow py-8 sm:py-10 lg:py-12 px-4 sm:px-6 animate-pulse" aria-label="Loading article">
                    <span className="sr-only">Loading article</span>

                    <header className="max-w-4xl mx-auto mb-8 sm:mb-10">
                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                            <div className="h-6 w-28 rounded-full bg-slate-200" />
                            <div className="h-4 w-32 rounded bg-slate-200" />
                        </div>

                        <div className="space-y-3">
                            <div className="h-8 sm:h-10 w-full max-w-3xl rounded bg-slate-200" />
                            <div className="h-8 sm:h-10 w-2/3 rounded bg-slate-200" />
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200" />
                            <div className="h-4 w-36 rounded bg-slate-200" />
                        </div>
                    </header>

                    <div className="max-w-4xl mx-auto mb-10 sm:mb-14 lg:mb-16">
                        <div className="aspect-video w-full rounded-lg sm:rounded-xl bg-slate-200" />
                    </div>

                    <section className="max-w-4xl mx-auto px-0 sm:px-2 lg:px-0 space-y-4">
                        <div className="h-4 w-full rounded bg-slate-200" />
                        <div className="h-4 w-full rounded bg-slate-200" />
                        <div className="h-4 w-5/6 rounded bg-slate-200" />
                        <div className="h-4 w-full rounded bg-slate-200 mt-8" />
                        <div className="h-4 w-full rounded bg-slate-200" />
                        <div className="h-4 w-3/4 rounded bg-slate-200" />
                    </section>
                </main>

                <Footer />
            </div>
        )
    }


    return (
        <div className="min-h-screen flex flex-col bg-background-light text-slate-900 font-display">
            <Navbar />

            <main className="flex-grow py-8 sm:py-10 lg:py-12 px-4 sm:px-6">

                {/* ARTICLE HEADER */}
                <header className="max-w-4xl mx-auto mb-8 sm:mb-10">

                    {/* CATEGORY + DATE */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {article.category}
                        </span>

                        <span className="text-slate-400 hidden sm:inline">•</span>

                        <span className="text-slate-500 text-xs">
                            {new Date(article.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>

                    {/* TITLE */}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    {/* AUTHOR */}
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-slate-600">

                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 overflow-hidden">
                                <img
                                    alt={article.display_name}
                                    className="w-full h-full object-cover"
                                    src={article.profile_photo}
                                />
                            </div>

                            <span className="font-medium text-slate-900 text-sm">
                                {article.display_name}
                            </span>
                        </div>
                    </div>

                </header>

                {/* FEATURE IMAGE */}
                <div className="max-w-4xl mx-auto mb-10 sm:mb-14 lg:mb-16 px-0">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg sm:rounded-xl bg-slate-100">
                        <img
                            src={article.cover_image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* ARTICLE CONTENT */}
                <article className="max-w-4xl mx-auto px-0 sm:px-2 lg:px-0">

                    <div
                        className="
            prose
            prose-sm sm:prose-base lg:prose-lg
            max-w-none
            prose-headings:text-slate-900
            prose-p:text-slate-700
            prose-strong:text-slate-900
            prose-code:text-emerald-700
            prose-pre:bg-slate-900
            prose-pre:text-slate-100
            prose-blockquote:border-emerald-700
          "
                        dangerouslySetInnerHTML={{
                            __html: article.content,
                        }}
                    />

                    {/* ENGAGEMENT */}
                    <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-200">

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

                            {/* TAGS */}
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-lime-100 text-lime-800 px-3 py-1 rounded text-xs font-medium">
                                    #{article.category}
                                </span>
                            </div>

                            {/* SHARE */}
                            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">

                                <span className="text-slate-500 text-sm font-medium">
                                    Share:
                                </span>

                                <button
                                    onClick={shareNative}
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-800 hover:text-white transition-colors"
                                >
                                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                                <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-800 hover:text-white transition-colors">
                                    <AtSign className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                                <button
                                    onClick={copyToClipboard}
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-800 hover:text-white transition-colors"
                                >
                                    <Link className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                            </div>

                        </div>

                    </div>

                </article>

                {/* RELATED ARTICLES */}
                {relatedArticles.length > 0 && (
                    <section className="max-w-6xl mx-auto mt-16 sm:mt-20 lg:mt-24 px-0 sm:px-2 lg:px-0">

                        {/* HEADER */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">

                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                Related Articles
                            </h2>

                            <RouterLink
                                to="/articles"
                                className="text-emerald-800 font-semibold flex items-center gap-1 hover:underline text-xs sm:text-sm"
                            >
                                View All
                                <ArrowRight className="w-4 h-4 text-slate-600" />
                            </RouterLink>

                        </div>

                        {/* GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

                            {relatedArticles.map((related) => (
                                <RouterLink
                                    to={`/articles/article/${related.id}`}
                                    key={related.id}
                                    className="group cursor-pointer"
                                >

                                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-slate-200 mb-4 bg-slate-100">
                                        <img
                                            alt={related.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            src={related.cover_image}
                                        />
                                    </div>

                                    <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest">
                                        {related.category}
                                    </span>

                                    <h3 className="text-base sm:text-lg font-bold mt-2 group-hover:text-emerald-800 transition-colors leading-snug">
                                        {related.title}
                                    </h3>

                                    <p className="text-slate-500 text-xs mt-2 sm:mt-3">
                                        {new Date(related.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>

                                </RouterLink>
                            ))}

                        </div>

                    </section>
                )}

            </main>

            <Footer />
        </div>
    )
}

export default Article;
