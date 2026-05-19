import { useForm } from 'react-hook-form'
import type { Login } from '../types/signupType'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import axios from 'axios'
import { use, useState } from 'react'
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
        console.log(response.data.token);
        localStorage.setItem('token', response.data.token)
        navigate('/')

     } catch (error: any) {
        console.log('Login error:', error.response.data.message)
        seterrmsg(error.response.data.message)
     }

        
    }
    return (
        <div className="mx-auto w-full max-w-lg space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
            <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Login</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                     Login account
                </h1>
            </div>

            {/* 🔐 Login form */}
            <form onSubmit={handleSubmit(handleCreateUser)} className="grid gap-4">
                <div className="grid gap-2">
                    <Input placeholder="Email" type="email" {...register('email', { required: true })} />
                    {errors.email && <span className="text-sm text-red-600">This field is required</span>}
                </div>

                <div className="grid gap-2">
                    <Input
                        placeholder="Password"
                        type="password"
                        {...register('password', { required: true })}
                    />
                    {errors.password && (
                        <span className="text-sm text-red-600">This field is required</span>
                    )}
                </div>

                {errmsg && <span className="text-sm text-red-600">{errmsg}</span>}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </div>
    )
}