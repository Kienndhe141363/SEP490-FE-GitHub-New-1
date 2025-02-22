"use client";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import Image from "next/image";
import logoImg from "@/public/assets/login/fsa_logo.png";
import { MdOutlineMailOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { VerifyEmailSchema } from "@/schema/verify-email-schema";
import login2 from "@/public/assets/images/login2.png";
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
import axios from "axios";
import router from "next/router";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BASE_API_URL } from "@/config/constant";

const VerifyEmail = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const router = useRouter(); // Sử dụng useRouter để chuyển hướng người dùng

  const form = useForm<z.infer<typeof VerifyEmailSchema>>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof VerifyEmailSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const response = await axios.post(`${BASE_API_URL}/auth/verify`,
          values
        );
        toast.success("OTP sent successfully!");
        localStorage.setItem("emailForReset", values.email); // Lưu email vào localStorage
        router.push("/authen/reset-password"); // Chuyển hướng đến trang reset-password
      } catch (error) {
        // @ts-ignore
        toast.error(error.response.data.message || "Something went wrong");
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
          alt="Logo"
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
          <h3 className="text-2xl font-bold mt-4">VERIFY YOUR EMAIL</h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col items-center mt-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="lg:w-7/12 w-10/12">
                    <FormLabel className="text-lg font-semibold">
                      Email
                    </FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Enter your email"
                          type="text"
                          className="h-14 border-gray-700 w-full pr-10"
                        />
                      </FormControl>
                      <MdOutlineMailOutline
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                        size={35}
                      />
                    </div>
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
                  className="mt-10 h-full bg-lightgreen font-bold shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-lightgreen"
                >
                  Send email
                </Button>
              </div>
              <p className="mt-8">
                <Link href="/authen/login" className="text-blue-500">
                  Return to login
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
