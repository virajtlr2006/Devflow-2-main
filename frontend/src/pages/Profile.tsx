import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { UserProfile } from "../types/profileType"
import { Button } from "../components/ui/button"

const Profile = () => {

    const [profile, setprofile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    
    const getProfile = async () => {
        const token = localStorage.getItem('token')
        if(!token){
            navigate('/login')
            return
        }
        try {
            const response = await axios.post('http://localhost:3030/auth/profile', null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setprofile(response.data)
        } catch (error) {
            console.log('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    useEffect(() => {
        getProfile()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md border border-gray-300 bg-white p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
                    <p className="text-sm text-gray-600 mt-1">Your account information</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <p className="text-gray-600">Loading...</p>
                    </div>
                ) : profile ? (
                    <div className="space-y-4">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-semibold text-gray-600">
                                    {profile.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="border border-gray-200 bg-gray-50 p-4 rounded">
                            <p className="text-xs text-gray-600 uppercase tracking-wide">Name</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">{profile.name}</p>
                        </div>

                        <div className="border border-gray-200 bg-gray-50 p-4 rounded">
                            <p className="text-xs text-gray-600 uppercase tracking-wide">Email</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1 break-all">{profile.email}</p>
                        </div>

                        <Button 
                            onClick={handleLogout} 
                            className="w-full mt-6 py-2 bg-red-600 text-white hover:bg-red-700"
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Failed to load profile. Please try again.</p>
                        <Button 
                            onClick={getProfile}
                            className="mt-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Retry
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile
