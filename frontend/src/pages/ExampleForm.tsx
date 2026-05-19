import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useAppStore } from '../store/useAppStore'

type FormValues = {
  name: string
  email: string
  message: string
}

function ExampleForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const count = useAppStore((state) => state.count)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setStatus('idle')
    setErrorMessage(null)

    try {
      await axios.post('https://jsonplaceholder.typicode.com/posts', data)
      setStatus('success')
      reset()
    } catch (error) {
      setStatus('error')
      setErrorMessage('Unable to submit the form. Please try again later.')
    }
  }

  return (
    <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Contact page</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Contact form powered by React Hook Form
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            This form demonstrates controlled validation, Axios submission, and state awareness from Zustand.
          </p>
        </div>

        <div className="rounded-3xl bg-slate-100 px-5 py-4 text-sm text-slate-700">
          Store count: <span className="font-semibold text-slate-900">{count}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            rows={5}
            className="min-h-[140px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Tell us about your project"
            {...register('message', { required: 'Message is required' })}
          />
          {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Send request'}
          </Button>
          {status === 'success' && (
            <p className="rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              Form submitted successfully.
            </p>
          )}
          {status === 'error' && errorMessage && (
            <p className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-700">{errorMessage}</p>
          )}
        </div>
      </form>
    </section>
  )
}

export default ExampleForm
