"use client";
import Checkbox from "@/components/form/input/Checkbox";
// import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { useSignupMutation } from "@/lib/redux/api/authApi";
import { setCredentials } from "@/lib/redux/slices/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

const Input = React.forwardRef(({ error, ...props }, ref) => {
  return (
    <>
      <input
        className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 ${error
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

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [signup, { isLoading, error }] = useSignupMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        email: data.email,
        password: data.password
      };

      const response = await signup(payload).unwrap();

      if (response.data?.auth_token) {
        dispatch(setCredentials({
          token: response.data.auth_token,
          admin: response.data.Admin,
          persist: isChecked
        }));
        router.push('/');
      }
    } catch (err) {
      // Error handled by RTK Query
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
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
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    {/* <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                    /> */}
                    <Input
                      type="text"
                      placeholder="Enter your first name"
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: {
                          value: 2,
                          message: 'Minimum 2 characters required'
                        }
                      })}
                      error={errors.firstName?.message}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    {/* <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                    /> */}
                    <Input
                      type="text"
                      placeholder="Enter your last name"
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: {
                          value: 2,
                          message: 'Minimum 2 characters required'
                        }
                      })}
                      error={errors.lastName?.message}
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  {/* <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                  /> */}
                  <Input
                    type="email"
                    placeholder="Enter your email"
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
                    Phone<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^\+?[1-9]\d{1,14}$/,
                        message: 'Invalid phone number format'
                      }
                    })}
                    error={errors.phone?.message}
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    {/* <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                    /> */}
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Minimum 8 characters required'
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message: 'Must contain uppercase, number, and special character'
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
                    {error.data?.message || 'Signup failed'}
                  </div>
                )}
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Sign Up
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
