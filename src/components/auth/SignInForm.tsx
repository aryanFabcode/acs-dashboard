"use client";
import Checkbox from "@/components/form/input/Checkbox";
// import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import React, { useState } from "react";
import { useLoginMutation } from "@/lib/redux/api/authApi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCredentials } from "@/lib/redux/slices/authSlice";

type FormValues = {
  email: string;
  password: string;
};

const Input = React.forwardRef(({ error, ...props }, ref) => {
  return (
    <>
      <input
        className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 ${
          error 
            ? 'border-error-500 focus:ring-error-500 dark:border-error-400'
            : 'border-gray-300 dark:border-gray-600'
        }`}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-500 dark:text-error-400">
          {error}
        </p>
      )}
    </>
  );
});
Input.displayName = 'Input';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();



  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data, "checking the data in this sign in page")
    try {
      const response = await login(data).unwrap();
      if (response.data?.auth_token) {
        dispatch(setCredentials({
          token: response.data.auth_token,
          admin: response.data.Admin,
          persist: isChecked
        }));
        router.push('/');
      }
    } catch (err) {
      // Error is already handled by RTK Query
    }
  };

  console.log(errors, 'checking the error sign in')

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      {/* <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div> */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    error={errors.email?.message}
                  />
                  
                </div>
                
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      error={errors.password?.message}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {error && (
                  <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error?.data?.message || 'Login failed'}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
