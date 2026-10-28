import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth';

const Register = () => {

    const {handleRegister} = useAuth()

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const handleFrom =async (e) => {
        try {

            e.preventDefault()
            console.log(name , email, password)

            if (!emailPattern.test(cleanEmail)) {

                alert(
                    "Please enter a valid email address"
                );

                return;
            }


            const response = await handleRegister({
                name : cleanName,
                email: cleanEmail,
                password : cleanPassword
            })

            alert("account created")

            console.log(response)


        } catch (error) {
            console.log(error)
        }     
    }





    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">
                        Create Account
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Create your Warranty Manager account
                    </p>
                </div>

                {/* Registration Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">

                    <form onSubmit={handleFrom}
                     className="space-y-5">

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                required

                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                minLength={3}
                                maxLength={20}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                minLength={10}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Password */}
                        <div className='relative'>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                maxLength={16}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/10 text-xm font-medium text-blue-400 hover:text-blue-300"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"

                            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                        >
                            Create Account
                        </button>

                    </form>

                    {/* Login */}
                    <p className="mt-6 text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <a
                            href="#/login"
                            className="font-medium text-blue-400 hover:text-blue-300"
                        >
                            Login
                        </a>
                    </p>

                </div>
            </div>
        </main>
    );
}

export default Register