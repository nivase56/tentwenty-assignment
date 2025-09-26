"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-black">
      {/* Login Form*/}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 py-12 lg:px-12">
        <div className="w-full max-w-xl">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-8 text-left">
            Welcome back
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
      {/* Brand  */}
      <div className="flex-1 flex items-center justify-center bg-blue-600 text-white p-8 lg:p-20">
        <div className="max-w-lg">
          <h1 className="font-bold text-3xl lg:text-4xl xl:text-5xl mb-6">
            ticktock
          </h1>
          <p className="text-sm lg:text-base xl:text-lg leading-relaxed">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours.
            Effortlessly track and monitor employee attendance and productivity
            from anywhere, anytime, using any internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
}
