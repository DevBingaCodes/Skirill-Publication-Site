import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { PenSquare, TableOfContents, Pencil } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { endpoint } from "../api"
import api from "../interceptor"
import { useEffect, useState } from "react"
import CountUp from "react-countup"

function Home() {
    const navigate = useNavigate()
    const [dashboard, setDashboard] = useState(null)
    const [loading, setLoading] = useState(true)

    //Home Dashboard
    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true)
            try {
                const response = await api.get(`${endpoint}/article/admin/dashboard`, {
                    withCredentials: true
                })
                // console.log(response.data)
                setDashboard(response.data)
            } catch (error) {
                console.error("Error fetching dashboard:", error);
                alert("Error fetching dashboard.")
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard()
    }, [])

    const stats = [
        {
            title: "Total Articles",
            value: dashboard?.stats?.totalArticles || 0
        },
        {
            title: "Published",
            value: dashboard?.stats?.published || 0
        },
        {
            title: "Drafts",
            value: dashboard?.stats?.drafts || 0
        },
        {
            title: "Categories",
            value: dashboard?.stats?.categories || 0
        }
    ]
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow" aria-busy={loading}>
                <div className="max-w-6xl mx-auto px-6 py-10">
                    {/* Page Heading */}
                    <header className="mb-10">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-black tracking-tight text-slate-900">
                                Admin Dashboard
                            </h1>

                            <p className="text-slate-500 text-sm">
                                Manage articles, publish new content, and monitor your blog.
                            </p>

                        </div>

                    </header>

                    {/* Stats Cards */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

                        {loading ? Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-white border border-slate-200 p-6 rounded-lg animate-pulse"
                            >
                                <div className="h-3 w-24 rounded bg-slate-200" />
                                <div className="h-9 w-16 rounded bg-slate-100 mt-3" />
                            </div>
                        )) : stats.map((stat, index) => (

                            <div
                                key={index}
                                className="bg-white border border-slate-200 p-6 rounded-lg transition"
                            >

                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    {stat.title}
                                </p>

                                <p className="mt-2 text-3xl font-bold text-emerald-800">
                                    <CountUp
                                        end={stat.value}
                                        duration={2}
                                        separator=","
                                    />
                                </p>
                            </div>

                        ))}

                    </section>

                    {/* Quick Actions */}
                    <section className="mb-12">

                        <h2 className="text-lg font-bold text-slate-900 mb-6">
                            Quick Actions
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {loading && Array.from({ length: 1 }).map((_, index) => (
                                <div
                                    key={`action-skeleton-${index}`}
                                    className="p-6 bg-white border border-slate-200 rounded-lg animate-pulse"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 mb-4" />
                                    <div className="h-5 w-3/5 rounded bg-slate-200 mb-2" />
                                    <div className="h-3 w-full rounded bg-slate-100 mb-2" />
                                    <div className="h-3 w-4/5 rounded bg-slate-100" />
                                </div>
                            ))}

                            {/* Publish / Complete Profile */}
                            {!loading && dashboard?.profile && (
                                dashboard.profile.canPublish ? (
                                    <Link to="/articles/new" className="group">

                                        <div className="flex flex-col p-6 bg-white border border-slate-200 rounded-lg hover:border-emerald-700 transition cursor-pointer">

                                            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4 text-emerald-800 group-hover:bg-primary group-hover:text-white transition-colors">
                                                <PenSquare />
                                            </div>

                                            <h3 className="text-md font-bold text-slate-900 mb-1">
                                                Publish an article
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Draft and publish a new article for your audience.
                                            </p>

                                        </div>

                                    </Link>
                                ) : (
                                    <Link to="/profile" className="group">

                                        <div className="flex flex-col p-6 bg-white border border-amber-200 rounded-lg hover:border-amber-400 transition cursor-pointer">

                                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4 text-amber-700">
                                                <Pencil />
                                            </div>

                                            <div className="flex items-center justify-between mb-2">

                                                <h3 className="text-md font-bold text-slate-900">
                                                    Complete your profile
                                                </h3>

                                                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                                                    {dashboard.profile.completion || 0}%
                                                </span>

                                            </div>

                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                Add your display name and profile photo before publishing articles.
                                            </p>

                                            <div className="mt-4 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400 transition-all duration-500"
                                                    style={{
                                                        width: `${dashboard.profile.completion || 0}%`
                                                    }}
                                                />
                                            </div>

                                        </div>

                                    </Link>
                                )
                            )}
                            {/* All Articles */}
                            <Link to="/articles" className="group">

                                <div className="flex flex-col p-6 bg-white border border-slate-200 rounded-lg hover:border-emerald-700 transition cursor-pointer ">

                                    <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4 text-emerald-800 group-hover:bg-primary group-hover:text-white transition-colors">

                                        <TableOfContents />

                                    </div>

                                    <h3 className="text-md font-bold text-slate-900 mb-1">
                                        All Articles
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        Browse your published articles, filter and view drafts.
                                    </p>

                                </div>

                            </Link>

                            {/* Manage */}
                            <Link to="/articles" className="group">

                                <div className="flex flex-col p-6 bg-white border border-slate-200 rounded-lg hover:border-emerald-700 transition cursor-pointer ">

                                    <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4 text-emerald-800 group-hover:bg-primary group-hover:text-white transition-colors">

                                        <Pencil />

                                    </div>

                                    <h3 className="text-md font-bold text-slate-900 mb-1">
                                        Manage Articles
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        Edit, organize, and maintain your content library.
                                    </p>

                                </div>

                            </Link>

                        </div>

                    </section>

                    {/* Recent Articles */}
                    <section>

                        <div className="flex items-center justify-between mb-6">

                            <h2 className="text-lg font-bold text-slate-900">
                                Recent Articles
                            </h2>

                            <Link
                                to="/articles"
                                className="text-xs font-semibold text-emerald-800 hover:underline"
                            >
                                View all
                            </Link>

                        </div>

                        <div className="overflow-hidden bg-white border border-slate-200 rounded-lg ">

                            <div className="overflow-x-auto">

                                <table className="w-full text-left border-collapse">

                                    <thead>

                                        <tr className="bg-slate-50 border-b border-slate-200">

                                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                                                Title
                                            </th>

                                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                                                Category
                                            </th>

                                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                                                Published
                                            </th>
                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            Array.from({ length: 5 }).map((_, index) => (
                                                <tr key={`article-skeleton-${index}`} className="animate-pulse">
                                                    <td className="px-6 py-4">
                                                        <div className="h-4 w-3/4 rounded bg-slate-100" />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="h-4 w-20 rounded bg-slate-100" />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="h-6 w-16 rounded-lg bg-slate-100" />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="h-4 w-28 rounded bg-slate-100" />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : dashboard?.recentArticles?.length > 0 ? (
                                            dashboard.recentArticles.map((article) => (
                                                <tr
                                                    key={article.id}
                                                    onClick={() => navigate(`/articles/article/${article.id}`)}
                                                    className="hover:bg-slate-50 cursor-pointer"
                                                >
                                                    <td className="px-6 py-4 font-medium text-xs">
                                                        {article.title}
                                                    </td>

                                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                                        {article.category || "Uncategorized"}
                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <span
                                                            className={`px-2 py-1 text-xs rounded-lg ${article.status === "published"
                                                                ? "bg-emerald-100 text-emerald-800"
                                                                : "bg-slate-100 text-slate-700"
                                                                }`}
                                                        >
                                                            {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                                                        </span>

                                                    </td>

                                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                                        {new Date(article.created_at).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric"
                                                        })}
                                                    </td>


                                                </tr>

                                            ))

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-10 text-center text-slate-500"
                                                >
                                                    <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">

                                                        {/* Blob / Illustration */}
                                                        <div className="relative w-40 h-40 mb-6">
                                                            <div className="absolute inset-0 bg-emerald-200/40 rounded-full blur-2xl animate-pulse"></div>
                                                            <div className="absolute inset-6 bg-emerald-300/60 rounded-full blur-xl animate-pulse"></div>
                                                            <div className="absolute inset-12 bg-emerald-500/20 rounded-full"></div>
                                                        </div>

                                                        {/* Text */}
                                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                                            No articles found
                                                        </h3>

                                                        <p className="text-slate-500 max-w-md text-sm">
                                                            Start by posting articles to view.
                                                        </p>
                                                    </div>
                                                </td>

                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </section>

                </div>

            </main>

            <Footer />

        </div>
    )
}

export default Home
