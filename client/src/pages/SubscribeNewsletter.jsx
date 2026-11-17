import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import { endpoint } from "../api"

function SubscribeNewsletter() {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setMessage("")
        setError("")
        setSubmitting(true)

        try {
            const response = await axios.post(`${endpoint}/newsletter/subscribe`, { email })
            setMessage(response.data.message || "Check your inbox to confirm your subscription.")
        } catch (requestError) {
            setError(requestError.response?.data?.message || "We couldn't process your subscription. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1 px-4 sm:px-6 py-14 sm:py-20 lg:py-28">
                <section className="max-w-content mx-auto">
                    <div className="max-w-xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-lime-100 text-emerald-900 text-xs font-bold uppercase tracking-wider rounded-full mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                            The Skirill newsletter
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            Ideas worth <span className="text-emerald-700">your inbox.</span>
                        </h1>
                        <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                            Get thoughtful writing on AI, DevOps, data engineering, and machine learning, delivered weekly.
                        </p>
                    </div>

                    <div className="max-w-xl mx-auto mt-9 sm:mt-12 bg-white border border-slate-200 rounded-sm p-6 sm:p-9 shadow-sm">
                        {message ? (
                            <div className="text-center" role="status" aria-live="polite">
                                <div className="w-12 h-12 mx-auto mb-4 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                        <path d="m5 12 4 4L19 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">One last step</h2>
                                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{message}</p>
                                <p className="mt-3 text-xs text-slate-500">Open the email we sent and follow the confirmation link to activate your subscription.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold text-slate-900">Join the newsletter</h2>
                                <p className="mt-1 text-sm text-slate-600">Enter your email and we’ll send you a confirmation link.</p>

                                <form onSubmit={handleSubmit} className="mt-6">
                                    <label htmlFor="newsletter-email" className="block text-xs font-semibold text-slate-700 mb-2">
                                        Email address
                                    </label>
                                    <input
                                        id="newsletter-email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        required
                                        maxLength={255}
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                                    />
                                    {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full mt-4 px-6 py-3 bg-emerald-800 text-white text-sm font-bold rounded-sm hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed transition-base"
                                    >
                                        {submitting ? "Sending confirmation…" : "Subscribe"}
                                    </button>
                                </form>

                                <p className="mt-4 text-xs text-slate-500 text-center leading-relaxed">
                                    You’ll need to confirm your email before your subscription becomes active.
                                </p>
                            </>
                        )}
                    </div>

                    <p className="mt-6 text-center text-xs text-slate-500">
                        Prefer to keep reading? <Link to="/articles" className="font-semibold text-emerald-700 hover:underline">Explore our articles</Link>
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default SubscribeNewsletter
