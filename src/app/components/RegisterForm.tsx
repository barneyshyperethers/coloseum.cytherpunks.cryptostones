import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const userSchema = z.object({
  accountType: z.literal("user"),
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long"),
  email: z.string().email("Invalid email address"),
  nickname: z
    .string()
    .min(3, "Nickname must be at least 3 characters long")
    .max(20, "Nickname must be at most 20 characters long"),
});

const companySchema = z.object({
  accountType: z.literal("company"),
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters long")
    .max(100, "Company name must be at most 100 characters long"),
  taxId: z
    .string()
    .min(5, "Tax ID must be at least 5 characters long")
    .max(20, "Tax ID must be at most 20 characters long"),
  email: z.string().email("Invalid email address"),
});

type UserFormFields = z.infer<typeof userSchema>;
type CompanyFormFields = z.infer<typeof companySchema>;
type FormFields = UserFormFields | CompanyFormFields;

type RegisterFormProps = {
  walletAddress: string;
};

export const RegisterForm = ({ walletAddress }: RegisterFormProps) => {
  const [accountType, setAccountType] = useState<"user" | "company" | null>(
    null
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentSchema = accountType === "user" ? userSchema : companySchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormFields>({
    resolver: zodResolver(currentSchema as any),
  });

  const handleAccountTypeSelect = (type: "user" | "company") => {
    setAccountType(type);
    setValue("accountType" as any, type);
    reset();
  };

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    try {
      localStorage.setItem(
        `registration_${walletAddress}`,
        JSON.stringify({ ...data, walletAddress })
      );
      setIsSubmitted(true);
      window.location.reload();
    } catch (error) {
      console.error("Error saving registration data:", error);
    }
  };

  return (
    <div className="w-[80%] h-[80vh] mx-auto flex flex-col items-center justify-center text-[#00BFFF]  ">
      {/* Success Screen */}
      {isSubmitted && (
        <div className="text-center">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Registration Complete!
          </h2>
          <p className="text-gray-600">
            Welcome to Crypto Blue Stones. Your account has been created
            successfully.
          </p>
        </div>
      )}

      {/* Account Type Selection */}
      {!isSubmitted && !accountType && (
        <>
          <h2 className="text-2xl font-bold text-[#00BFFF] mb-6 text-center cosmic-text-glow">
            Choose Account Type
          </h2>
          <p className="text-white text-center mb-8">
            Select how you'd like to register with Crypto Blue Stones
          </p>

          <div className=" flex justify-center items-center w-[50%] mx-auto gap-8">
            <button
              onClick={() => handleAccountTypeSelect("user")}
              className="w-full text-[#00BFFF] py-8 px-6 hover:text-[#00BFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium text-lg cosmic-text-glow"
            >
              👤 Register as User
              <div className="text-sm font-normal mt-1 opacity-90">
                Personal account for individuals
              </div>
            </button>

            <button
              onClick={() => handleAccountTypeSelect("company")}
              className="w-full text-[#00BFFF] py-8 px-6 hover:text-[#00BFFF] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium text-lg"
            >
              🏢 Register as Company
              <div className="text-sm font-normal mt-1 opacity-90">
                Business account for organizations
              </div>
            </button>
          </div>
        </>
      )}

      {/* Registration Form */}
      {!isSubmitted && accountType && (
        <>
          <div className="flex items-center justify-between ">
            <h2 className="text-2xl font-bold text-white">
              Register as {accountType === "user" ? "User" : "Company"}
            </h2>
            <button
              onClick={() => setAccountType(null)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Change Type
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="hidden"
              {...register("accountType" as any)}
              value={accountType || ""}
            />
            {accountType === "user" ? (
              <>
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    {...register("fullName" as any)}
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full text-black px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors ${
                      (errors as any).fullName
                        ? "border-red-500"
                        : "border-[#1e1e3f]"
                    }`}
                  />
                  <div className="h-5 mt-1">
                    {(errors as any).fullName && (
                      <p className="text-sm text-red-600">
                        {(errors as any).fullName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    {...register("email" as any)}
                    id="email"
                    type="text"
                    placeholder="Enter your email"
                    className={`w-full text-black px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors ${
                      (errors as any).email
                        ? "border-red-500"
                        : "border-[#1e1e3f]"
                    }`}
                  />
                  <div className="h-5 mt-1">
                    {(errors as any).email && (
                      <p className="text-sm text-red-600">
                        {(errors as any).email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="nickname"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nickname *
                  </label>
                  <input
                    {...register("nickname" as any)}
                    id="nickname"
                    type="text"
                    placeholder="Choose a nickname"
                    className={`w-full text-black px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors ${
                      (errors as any).nickname
                        ? "border-red-500"
                        : "border-[#1e1e3f]"
                    }`}
                  />
                  <div className="h-5 mt-1">
                    {(errors as any).nickname && (
                      <p className="text-sm text-red-600">
                        {(errors as any).nickname.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Name *
                  </label>
                  <input
                    {...register("name" as any)}
                    id="name"
                    type="text"
                    placeholder="Enter company name"
                    className={`w-full text-black px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors ${
                      (errors as any).name
                        ? "border-red-500"
                        : "border-[#1e1e3f]"
                    }`}
                  />
                  <div className="h-5 mt-1">
                    {(errors as any).name && (
                      <p className="text-sm text-red-600">
                        {(errors as any).name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="taxId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tax ID *
                  </label>
                  <input
                    {...register("taxId" as any)}
                    id="taxId"
                    type="text"
                    placeholder="Enter tax ID"
                    className={`w-full text-black px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors ${
                      (errors as any).taxId
                        ? "border-red-500"
                        : "border-[#1e1e3f]"
                    }`}
                  />
                  <div className="h-5 mt-1">
                    {(errors as any).taxId && (
                      <p className="text-sm text-red-600">
                        {(errors as any).taxId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    {...register("email" as any)}
                    id="email"
                    type="text"
                    placeholder="Enter company email"
                    className={`w-full text-black px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors ${
                      (errors as any).email
                        ? "border-red-500"
                        : "border-[#1e1e3f]"
                    }`}
                  />
                  <div className="h-5 mt-1">
                    {(errors as any).email && (
                      <p className="text-sm text-red-600">
                        {(errors as any).email.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className={`w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors font-medium ${
                accountType === "user"
                  ? "text-[#00BFFF] hover:text-[#00BFFF] focus:ring-[#00BFFF] cosmic-text-glow"
                  : "text-[#00BFFF] hover:text-[#00BFFF] focus:ring-[#00BFFF] cosmic-text-glow"
              }`}
            >
              Register as {accountType === "user" ? "User" : "Company"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};
