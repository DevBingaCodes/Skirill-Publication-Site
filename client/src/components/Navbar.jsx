import { useState } from "react"
import { Link } from "react-router-dom"

function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <nav className="max-w-content mx-auto px-6 h-20 flex items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-8">
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src="https://publication-site.s3.eu-north-1.amazonaws.com/site_images/favicon.png"
                            alt="Skirill Logo"
                            className="w-6 h-6 object-contain"
                        />
                        <span className="text-lg font-extrabold text-emerald-900 tracking-tight">
                            Skirill
                        </span>
                    </a>

                    {/* DESKTOP LINKS */}
                    <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
                        <a href="/" className="hover:text-emerald-700">Home</a>
                        <a href="/articles" className="hover:text-emerald-700">Articles</a>
                        <a href="/about" className="hover:text-emerald-700">About</a>
                    </div>
                </div>

                {/* RIGHT (DESKTOP BUTTONS) */}
                <div className="hidden md:flex items-center gap-3">
                    <Link to="/newsletter/subscribe" className="px-4 py-2 border border-emerald-800 text-emerald-800 text-xs font-semibold rounded-sm hover:bg-emerald-50">
                        Subscribe
                    </Link>
                    <Link to="/articles" className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-sm hover:bg-emerald-900">
                        Read Articles
                    </Link>
                </div>

                {/* MOBILE HAMBURGER */}
                <button
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    <div className="relative w-5 h-5">
                        {/* Hamburger */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out ${open ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>

                        {/* X */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`absolute inset-0 w-5 h-5 transition-all duration-300 ease-in-out ${open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                </button>
            </nav>

            {/* MOBILE MENU (FLOATING) */}
            {open && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-lg">
                    <div className="flex flex-col px-6 py-4 gap-4 text-sm text-slate-700">

                        <a href="/" onClick={() => setOpen(false)}>Home</a>
                        <a href="/articles" onClick={() => setOpen(false)}>Articles</a>
                        <a href="/about" onClick={() => setOpen(false)}>About</a>

                        <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                            <Link className="px-4 py-2 border border-emerald-800 text-emerald-800 rounded-sm text-center">
                                Subscribe
                            </Link>
                            <Link to="/articles" className="px-4 py-2 bg-emerald-800 text-white rounded-sm text-center">
                                Read Articles
                            </Link>
                        </div>

                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar