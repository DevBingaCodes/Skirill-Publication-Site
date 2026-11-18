import LoginNav from "../components/LoginNav"
import Footer from "../components/Footer"
import Spinner from "../components/Spinner"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { endpoint } from "../api"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "../components/ToastContext"


function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const { showToast, updateToast } = useToast();

    // Validate Input Fields
    const validateField = (name, value) => {
        if (name === "email") {
            if (!value) return "Email is required";
            if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        }
        if (name === "password") {
            if (!value) return "Password is required";
        }
        return "";
    }

    const validateForm = () => {
        const errors = {};
        if (!formData.email) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            errors.email = "Invalid email format";
        if (!formData.password) errors.password = "Password is required";
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);

        const toastId = showToast({
            type: "loading",
            title: "Signing In",
            message: "Verifying credentials..."
        });

        try {
            const response = await fetch(`${endpoint}/auth/admin/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.message === "You are already logged in.") {
                updateToast(toastId, {
                    type: "success",
                    title: "Already Signed In",
                    message: "Redirecting to dashboard..."
                });
                navigate("/home", { replace: true });
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            updateToast(toastId, {
                type: "success",
                title: "Login Successful",
                message: "Redirecting to dashboard..."
            });

            setTimeout(() => {
                navigate("/home");
            }, 1000);

        } catch (error) {
            updateToast(toastId, {
                type: "error",
                title: "Sign In Failed",
                message: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <LoginNav />
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white  rounded-lg border border-slate-300  overflow-hidden">
                    <div className="p-8 flex flex-col gap-6">
                        {/* Header */}
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="mt-4">
                                <h2 className="text-slate-900  text-xl font-bold leading-tight">
                                    Admin Login
                                </h2>
                                <p className="text-slate-500  text-xs font-normal leading-normal mt-2">
                                    Access the admin panel to write and manage technical articles.
                                </p>
                            </div>
                        </div>


                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-700 text-xs font-medium">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@aisystems.blog"
                                    className="w-full px-4 py-3 rounded-md border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 placeholder:text-xs"
                                />
                            </div>


                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-slate-700 text-xs font-medium">
                                        Password
                                    </label>

                                    <Link
                                        className="text-primary text-xs font-semibold hover:underline"
                                        to="/password/reset"
                                    >
                                        Trouble logging in?
                                    </Link>

                                </div>
                                <div className="relative flex items-stretch">
                                    <input
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-md border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 placeholder:text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-900 "
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-5 bg-primary text-white text-base font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all"
                                    ${loading
                                        ? "opacity-70 cursor-not-allowed"
                                        : "hover:opacity-90 active:scale-[0.98]"
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner />
                                        <span>Signing In...</span>
                                    </div>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>
                        </form>


                        {/* Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 "></div>
                            </div>

                            <div className="relative flex justify-center text-xs uppercase">

                                <span className="bg-white  px-2 text-slate-500">
                                    Secure Environment
                                </span>

                            </div>

                        </div>


                        {/* Footer */}
                        <div className="text-center">
                            <p className="text-slate-600 text-xs">
                                Don't have an account?
                                <a
                                    className="text-primary font-semibold hover:underline ml-1"
                                    href="/register"
                                >
                                    Create one
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

        </div>
    )
}

export default Login
