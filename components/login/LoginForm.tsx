"use client";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import Image from "next/image";
import loginImg from "@/public/assets/authentication/images/loginImg.png";
import logoImg from "@/public/assets/login/fsa_logo.png";
import login2 from "@/public/assets/images/login2.png";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/custom/form-error";
import { FormSuccess } from "@/components/custom/form-success";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/UserStore";
import { BASE_API_URL } from "@/config/constant";
import toast from "react-hot-toast";

const SignIn = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isViewPassword, setIsViewPassword] = useState<boolean>(true);
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      account: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const response = await axios.post(`${BASE_API_URL}/auth/login`, values);
        const jwtToken = response.data.token;
        toast.success("Success!");
        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("role", response.data.role);
        router.push("/authen/dashboard");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const errorCode = error.response.data.errorCode;

          if (errorCode === "ERR014") {
            toast.error("Wrong password");
          } else if (errorCode === "ERR015") {
            toast.error("Check your account again!");
          }
        } else {
          toast.error("Something went wrong");
        }
      }
    });
  };

  return (
    <div className="w-full h-screen bg-gray-100 relative overflow-hidden">
      {/* Hình tròn ở góc trên bên trái */}
      <div className="absolute w-[600px] h-[600px] left-[-100px] top-[-100px] bg-[rgba(111,188,68,0.5)] rounded-full"></div>

      {/* Hình vuông ở bên phải */}
      <div className="absolute w-[800px] h-[800px] left-[1000px]  bg-[rgba(111,188,68,0.5)] rotate-[-31.74deg] clip-path-triangle"></div>

      <div className="absolute flex left-0 right-0 top-0 bottom-0 ml-auto mr-auto mt-auto mb-auto bg-white z-10 h-[600px] lg:w-9/12 border-4 border-green-500 rounded-3xl p-6"> {/* Thêm border và padding */}
        <Image
          className="lg:block hidden w-5/12 mr-6 ml-12 object-contain"
          src={login2.src}
          width={login2.width}
          height={login2.height}
          alt="Picture "
        />

        <div className="form lg:w-7/12 w-full flex flex-col items-center justify-center">
          <div>
            <Image
              src={logoImg.src}
              width={200}
              height={logoImg.height}
              alt="Picture "
              className="object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold mt-4">Sign In</h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col items-center mt-8"
            >
              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem className="lg:w-7/12 w-10/12">
                    <FormLabel className="text-lg font-semibold">
                      Account
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter your account..."
                        type="text"
                        className="h-14 border-gray-700 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="lg:w-7/12 w-10/12 mt-4">
                    <FormLabel className="text-lg font-semibold">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Enter your password..."
                          type={isViewPassword ? "password" : "text"}
                          className="h-14 border-gray-700 w-full"
                        />
                        {isViewPassword ? (
                          <EyeOff
                            onClick={() => setIsViewPassword(false)}
                            className="text-crusta absolute right-2 top-4 z-50 w-5"
                          />
                        ) : (
                          <Eye
                            onClick={() => setIsViewPassword(true)}
                            className="text-crusta absolute right-2 top-4 z-50 w-5"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormError message={error} />
              <FormSuccess message={success} />
              <div className="flex lg:w-7/12 w-10/12 h-14 items-center justify-center">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="mt-10 w-full bg-lightgreen font-bold shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-lightgreen"
                >
                  Sign In
                </Button>
              </div>
              <p className="mt-8">
                Forgot password?
                <a href="/authen/verify-email" className="text-blue-500">
                  Click me
                </a>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;