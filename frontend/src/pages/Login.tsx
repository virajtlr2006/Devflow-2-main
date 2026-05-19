import { useForm } from 'react-hook-form'
import type { Login } from '../types/signupType'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import axios from 'axios'
import {  useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signin() {

    const [errmsg, seterrmsg] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Login>({
        defaultValues: {
            email: '',
            password: '',
        },
    })

    // ✨ log form data
    const navigate = useNavigate()
    const handleCreateUser = async (data: Login) => {


        console.log('Form data:', data)
     try {
           const response = await axios.post('http://localhost:3030/login', data)
        // console.log(response.data.token);
        localStorage.setItem('token', response.data.token)
        navigate('/')

     } catch (error: any) {
        console.log('Login error:', error.response.data.message)
        seterrmsg(error.response.data.message)
     }

        
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md border border-gray-300 bg-white p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Login</h1>
                    <p className="text-sm text-gray-600 mt-1">Sign in to your account</p>
                </div>

                {/* 🔐 Login form */}
                <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
                    <div>
                        <Input placeholder="Email" type="email" {...register('email', { required: true })} className="w-full border border-gray-300 px-3 py-2" />
                        {errors.email && <span className="text-sm text-red-600 block mt-1">This field is required</span>}
                    </div>

                    <div>
                        <Input
                            placeholder="Password"
                            type="password"
                            {...register('password', { required: true })}
                            className="w-full border border-gray-300 px-3 py-2"
                        />
                        {errors.password && (
                            <span className="text-sm text-red-600 block mt-1">This field is required</span>
                        )}
                    </div>

                    {errmsg && <div className="border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 rounded">{errmsg}</div>}
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700">
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </div>
        </div>
    )
}