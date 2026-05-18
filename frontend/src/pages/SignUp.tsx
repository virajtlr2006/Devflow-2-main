import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { SignUp, SignUp as SignUpValues } from '../types/signupType'
import axios from 'axios'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '../components/ui/input-otp'

export default function SignUp() {
    const [isOtp, setIsOtp] = useState(false)
    const [otp, setOtp] = useState('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [user, setuser] = useState<SignUp | null>(null)
    const [wrongOTP, setwrongOTP] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<SignUpValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    })

    // ✨ create user and switch to OTP flow
    const handleCreateUser = async (data: SignUpValues) => {
        setErrorMessage(null)
        setuser(data)
        try {
            await axios.post('http://localhost:3030/signup', data)
            setIsOtp(true)
            reset()
        } catch (error) {
            setErrorMessage('Unable to create the account. Please try again later.')
        }
    }

    // 🔐 verify OTP submission
    const handleOTP = async () => {
        if (!user) return
        try {
            const response = await axios.post("http://localhost:3030/otp", {
                "email": user.email,
                "name": user.name,
                "password": user.password,
                "otp": otp
            })
            console.log(response.data.message)
        } catch (error) {
            setwrongOTP(true)
        }

    }
    return (
        <div className="mx-auto w-full max-w-lg space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
            <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sign up</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                    Create your account
                </h1>
            </div>

            {/* 🔐 OTP verification step */}
            {isOtp ? (
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">Enter the 6-digit code sent to your email.</p>
                    <InputOTP maxLength={6} value={otp} onChange={(value) => {
                        setOtp(value)
                    }}>

                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    {wrongOTP && 
                    <p className='text-red-900'>Enter Valid OTP</p>
                    }
                    <Button type="button" variant="secondary" onClick={() => handleOTP()}>
                        Verify OTP
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(handleCreateUser)} className="grid gap-4">
                    <div className="grid gap-2">
                        <Input placeholder="Name" type="text" {...register('name', { required: true })} />
                        {errors.name && <span className="text-sm text-red-600">This field is required</span>}
                    </div>

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

                    {errorMessage && (
                        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </p>
                    )}

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>
            )}
        </div>
    )
}