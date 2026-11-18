import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import api from "../interceptor"
import {
    X,
    Save,
    Camera,
    Globe,
    Share2,
    BookOpen,
    Fingerprint,
    Pencil,
    PoundSterlingIcon,
    List
} from "lucide-react"
import axios from "axios"
import { useState, useEffect } from "react"
import { endpoint } from "../api"
import { useToast } from "../components/ToastContext"

function Profile() {
    const [profile, setProfile] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        displayName: "",
        bio: "",
        about: "",
        website: "",
        twitter: "",
        linkedin: ""
    })
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [uploadedFile, setUploadedFile] = useState(null)
    const { showToast, updateToast } = useToast();

    //Profile useEffect
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`${endpoint}/profile/my-profile`, {
                    withCredentials: true
                })

                const profileData = response.data.profile

                setProfile(profileData)

                setFormData({
                    username: profileData.username || "",
                    displayName: profileData.display_name || "",
                    bio: profileData.bio || "",
                    about: profileData.about || "",
                    website: profileData.website || "",
                    twitter: profileData.twitter || "",
                    linkedin: profileData.linkedin || ""
                })

                setProfilePhoto(profileData.profile_photo)
            } catch (error) {
                console.log(error)
                console.error("Error fetching profile:", error);
                alert("Error fetching profile.")
            }
        }
        fetchProfile()
    }, [])

    //Edit Handler
    const handleEdit = () => {
        setIsEditing(true)
    }

    //Cancel Handler
    const handleCancel = () => {
        setIsEditing(false)

        setFormData({
            username: profile.username || "",
            displayName: profile.display_name || "",
            bio: profile.bio || "",
            about: profile.about || "",
            website: profile.website || "",
            twitter: profile.twitter || "",
            linkedin: profile.linkedin || ""
        })

        setProfilePhoto(profile.profile_photo)
        setUploadedFile(null)
    }

    //Image Upload Handler
    const handleImageUpload = (e) => {
        const file = e.target.files[0]

        if (!file) return

        setUploadedFile(file)

        const imageUrl = URL.createObjectURL(file)

        setProfilePhoto(imageUrl)
    }

    //Save Changes Handler
    const handleSave = async () => {
        try {
            const payload = new FormData()

            const toastId = showToast({
                type: "loading",
                title: "Saving Profile",
                message: "Saving..."
            });

            payload.append("username", formData.username)
            payload.append("displayName", formData.displayName)
            payload.append("bio", formData.bio)
            payload.append("about", formData.about)
            payload.append("website", formData.website)
            payload.append("twitter", formData.twitter)
            payload.append("linkedin", formData.linkedin)

            if (uploadedFile) {
                payload.append("profile_photo", uploadedFile)
            }

            const response = await api.patch(
                `${endpoint}/profile/edit/${profile.id}`,
                payload,
                { withCredentials: true }
            )

            setProfile(response.data.profile)

            setIsEditing(false)

            updateToast(toastId, {
                type: "success",
                title: "Profile Update",
                message: "Profile saved"
            });

        } catch (error) {
            console.log(error)
            updateToast(toastId, {
                type: "error",
                title: "Failed to save profile. Please try again later.",
                message: error.message
            });
        }
    }

    // Loading State
    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col" aria-busy="true" aria-label="Loading profile">
                <Navbar />

                <main className="flex-grow">
                    <div className="max-w-6xl mx-auto px-6 py-10 animate-pulse">
                        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-200">
                            <div className="space-y-3">
                                <div className="h-7 w-48 rounded bg-slate-200" />
                                <div className="h-4 w-80 max-w-full rounded bg-slate-100" />
                            </div>
                            <div className="h-10 w-32 rounded-sm bg-slate-200" />
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <aside className="lg:col-span-4">
                                <section className="bg-white border border-slate-200 rounded-sm p-6 text-center">
                                    <div className="w-32 h-32 rounded-full bg-slate-200 mx-auto" />
                                    <div className="mt-6 space-y-3">
                                        <div className="h-4 w-2/3 rounded bg-slate-200 mx-auto" />
                                        <div className="h-3 w-1/2 rounded bg-slate-100 mx-auto" />
                                        <div className="h-3 w-3/4 rounded bg-slate-100 mx-auto" />
                                    </div>
                                </section>
                            </aside>

                            <div className="lg:col-span-8 space-y-10">
                                <section>
                                    <div className="h-6 w-40 rounded bg-slate-200 mb-6" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="h-4 w-24 rounded bg-slate-200" />
                                            <div className="h-4 w-3/4 rounded bg-slate-100" />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-4 w-20 rounded bg-slate-200" />
                                            <div className="h-4 w-2/3 rounded bg-slate-100" />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <div className="h-4 w-16 rounded bg-slate-200" />
                                            <div className="h-4 w-full rounded bg-slate-100" />
                                        </div>
                                    </div>
                                </section>

                                <section className="border-t border-slate-100 pt-10">
                                    <div className="h-6 w-24 rounded bg-slate-200 mb-6" />
                                    <div className="space-y-3">
                                        <div className="h-4 w-full rounded bg-slate-100" />
                                        <div className="h-4 w-5/6 rounded bg-slate-100" />
                                        <div className="h-4 w-2/3 rounded bg-slate-100" />
                                        <div className="h-20 w-full rounded bg-slate-100 mt-4" />
                                    </div>
                                </section>

                                <section className="border-t border-slate-100 pt-10">
                                    <div className="h-6 w-48 rounded bg-slate-200 mb-6" />
                                    <div className="space-y-4">
                                        {[0, 1, 2].map((item) => (
                                            <div key={item} className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-sm bg-slate-100 border border-slate-200" />
                                                <div className="h-4 w-2/3 rounded bg-slate-100" />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-200">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-black tracking-tight text-gray-900">
                                Profile Settings
                            </h1>

                            <p className="text-slate-500 text-sm">
                                Manage your public author profile and technical identity.
                            </p>
                        </div>

                        {/* Edit Profile and Cancel Buttons */}
                        <div className="flex items-center gap-3">
                            {isEditing && (
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 border border-emerald-800 text-sm font-medium text-gray-600 hover:bg-emerald-50 transition-colors flex items-center gap-2 cursor-pointer"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                            )}

                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-sm text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <Pencil size={16} />
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-sm text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <Save size={16} />
                                    Save Changes
                                </button>
                            )}

                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* LEFT COLUMN */}
                        <aside className="lg:col-span-4 space-y-8">

                            {/* Avatar Card */}
                            <section className="bg-white border border-slate-200 rounded-sm p-6 text-center">

                                <div className="relative inline-block">

                                    <div className="w-32 h-32 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mx-auto overflow-hidden group hover:border-emerald-700 transition-colors cursor-pointer">
                                        <img
                                            alt={profile.display_name}
                                            className="w-full h-full object-cover"
                                            src={profilePhoto}
                                        />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-900">
                                                Upload
                                            </span>
                                        </div>

                                    </div>

                                    <label className={`absolute bottom-0 right-0 p-2 bg-white border border-slate-200 rounded-full hover:text-emerald-700 ${isEditing ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}>
                                        <Camera size={16} />

                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            disabled={!isEditing}
                                            onChange={handleImageUpload}
                                        />
                                    </label>

                                </div>

                                <div className="mt-4">
                                    {/* //Display Name */}
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.displayName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    displayName: e.target.value
                                                })
                                            }
                                            className="w-full border border-slate-200 rounded-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-700"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Name: {profile.display_name}
                                        </p>
                                    )}

                                    <p className="text-sm text-gray-500">
                                        Username: @{profile.username}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Email: {profile.email}
                                    </p>
                                </div>
                            </section>
                        </aside>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-8 space-y-10">

                            {/* Identity */}
                            <section>

                                <div className="flex items-center gap-2 mb-6 text-emerald-800">
                                    <Fingerprint size={20} />
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Public Identity
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div className="space-y-2">

                                        <label className="text-sm font-medium text-gray-900">
                                            Display Name
                                        </label>

                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.displayName}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        displayName: e.target.value
                                                    })
                                                }
                                                className="w-full border border-slate-200 rounded-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-700"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                {profile.display_name}
                                            </p>
                                        )}

                                    </div>

                                    <div className="space-y-2">

                                        <label className="text-sm font-medium text-gray-900">
                                            Username
                                        </label>

                                        <div className="relative">

                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">

                                            </span>

                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.username}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            username: e.target.value
                                                        })
                                                    }
                                                    className="w-full border border-slate-200 rounded-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-700"
                                                />
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    {profile.username}
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                    <div className="md:col-span-2 space-y-2">

                                        <label className="text-sm font-medium text-gray-900">
                                            Short Bio
                                        </label>

                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.bio}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        bio: e.target.value
                                                    })
                                                }
                                                className="w-full border border-slate-200 rounded-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-700"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                {profile.bio}
                                            </p>
                                        )}
                                        <p className="text-[11px] text-gray-500">
                                            Maximum 160 characters.
                                        </p>

                                    </div>

                                </div>

                            </section>

                            {/* About */}
                            <section>

                                <div className="flex items-center gap-2 mb-6 text-emerald-800 border-t border-slate-100 pt-10">
                                    <BookOpen size={20} />

                                    <h2 className="text-lg font-semibold text-gray-900">
                                        About
                                    </h2>
                                </div>

                                <div className="space-y-2">

                                    <label className="text-sm font-medium text-gray-900">
                                        About
                                    </label>
                                    {/* About */}
                                    {isEditing ? (
                                        <textarea
                                            rows={6}
                                            value={formData.about}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    about: e.target.value
                                                })
                                            }
                                            className="w-full border border-slate-200 rounded-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            {profile.about}
                                        </p>
                                    )}

                                    <p className="text-[11px] text-gray-500">
                                        Markdown is supported for links and formatting.
                                    </p>

                                </div>

                            </section>

                            {/* Social Links */}
                            <section>

                                <div className="flex items-center gap-2 mb-6 text-emerald-800 border-t border-slate-100 pt-10">
                                    <Share2 size={20} />

                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Social Connections
                                    </h2>
                                </div>

                                <div className="space-y-4">

                                    <div className="flex items-center gap-4">

                                        <div className="w-10 h-10 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-200 text-gray-500">
                                            <Globe size={18} className="text-gray-700" />
                                        </div>

                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.website}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        website: e.target.value
                                                    })
                                                }
                                                className="w-full border border-slate-200 rounded-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-700"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                {profile.website}
                                            </p>
                                        )}

                                    </div>

                                    {/* Twitter Section */}
                                    <div className="flex items-center gap-4">

                                        <div className="w-10 h-10 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-200 text-gray-500">
                                            <Globe size={18} className="text-sky-500" />
                                        </div>

                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.twitter}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        twitter: e.target.value
                                                    })
                                                }
                                                placeholder="twitter"
                                                className="w-full border border-slate-200 rounded-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-700"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                {profile.twitter}
                                            </p>
                                        )}

                                    </div>
                                    {/* LinkedIn */}
                                    <div className="flex items-center gap-4">

                                        <div className="w-10 h-10 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-200 text-gray-500">
                                            <Globe size={18} className="text-blue-600" />
                                        </div>

                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.linkedin}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        linkedin: e.target.value
                                                    })
                                                }
                                                className="w-full border border-slate-200 rounded-sm px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-700"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                {profile.linkedin}
                                            </p>
                                        )}

                                    </div>

                                </div>

                            </section>

                        </div>

                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Profile
