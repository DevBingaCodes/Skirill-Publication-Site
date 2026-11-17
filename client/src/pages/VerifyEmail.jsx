import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { endpoint } from "../api"

function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const [status, setStatus] = useState("loading")
    const [message, setMessage] = useState("")

    useEffect(() => {
        let cancelled = false

        const verifySubscription = async () => {
            if (!token) {
                setStatus("error")
                setMessage("This verification link is missing its token. Please request a new confirmation email.")
                return
            }

            try {
                const response = await axios.get(`${endpoint}/newsletter/verify-email`, {
                    params: { token },
                })
                if (!cancelled) {
                    setStatus("success")
                    setMessage(response.data.message || "Your subscription has been confirmed successfully!")
                }
            } catch (requestError) {
                if (!cancelled) {
                    setStatus("error")
                    setMessage(requestError.response?.data?.message || "We couldn't verify your subscription. Please try again.")
                }
            }
        }

        verifySubscription()
        return () => { cancelled = true }
    }, [token])

    const isLoading = status === "loading"
    const isSuccess = status === "success"

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1 px-4 sm:px-6 py-14 sm:py-20 lg:py-28 flex items-center">
                <section className="max-w-content mx-auto w-full">
                    <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-sm p-7 sm:p-10 text-center shadow-sm">
                        <div className={`w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center ${isLoading ? "bg-slate-100 text-slate-500" : isSuccess ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"}`}>
                            {isLoading ? (
                                <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
                                    <path className="opacity-75" d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            ) : isSuccess ? (
                                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                    <path d="m5 12 4 4L19 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                    <path d="M12 8v4m0 4h.01M10.3 3.86 1.82 18.5A2 2 0 0 0 3.55 21h16.9a2 2 0 0 0 1.73-2.5L13.7 3.86a2 2 0 0 0-3.4 0Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>

                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">The Skirill newsletter</p>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            {isLoading ? "Confirming your subscription" : isSuccess ? "You’re subscribed" : "We couldn’t confirm your email"}
                        </h1>
                        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed" role="status" aria-live="polite">
                            {isLoading ? "Please wait while we verify your confirmation link." : message}
                        </p>

                        {!isLoading && (
                            <div className="mt-7 flex flex-col sm:flex-row items-stretch justify-center gap-3">
                                {isSuccess ? (
                                    <Link to="/articles" className="px-6 py-3 bg-emerald-800 text-white text-sm font-bold rounded-sm hover:bg-emerald-900 transition-base">
                                        Explore publications
                                    </Link>
                                ) : (
                                    <Link to="/newsletter/subscribe" className="px-6 py-3 bg-emerald-800 text-white text-sm font-bold rounded-sm hover:bg-emerald-900 transition-base">
                                        Request a new link
                                    </Link>
                                )}
                                <Link to="/" className="px-6 py-3 border border-slate-300 text-slate-700 text-sm font-semibold rounded-sm hover:bg-slate-50 transition-base">
                                    Back to home
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default VerifyEmail
