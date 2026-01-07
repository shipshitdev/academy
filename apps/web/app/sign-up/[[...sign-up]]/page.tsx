"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "hsl(262 83% 58%)",
            colorBackground: "hsl(0 0% 6%)",
            colorText: "hsl(0 0% 98%)",
            colorTextSecondary: "hsl(0 0% 64%)",
            colorInputBackground: "hsl(0 0% 10%)",
            colorInputText: "hsl(0 0% 98%)",
            borderRadius: "0.5rem",
          },
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-[hsl(0_0%_6%)] border border-[hsl(0_0%_14%)] shadow-xl",
            headerTitle: "text-[hsl(0_0%_98%)]",
            headerSubtitle: "text-[hsl(0_0%_64%)]",
            socialButtonsBlockButton:
              "border-[hsl(0_0%_14%)] bg-[hsl(0_0%_10%)] hover:bg-[hsl(0_0%_12%)]",
            socialButtonsBlockButtonText: "text-[hsl(0_0%_98%)]",
            dividerLine: "bg-[hsl(0_0%_14%)]",
            dividerText: "text-[hsl(0_0%_64%)]",
            formFieldLabel: "text-[hsl(0_0%_98%)]",
            formFieldInput:
              "bg-[hsl(0_0%_10%)] border-[hsl(0_0%_14%)] text-[hsl(0_0%_98%)] focus:ring-[hsl(262_83%_58%)] focus:border-[hsl(262_83%_58%)]",
            formButtonPrimary:
              "bg-[hsl(262_83%_58%)] hover:bg-[hsl(262_83%_50%)] text-white",
            footerActionLink: "text-[hsl(262_83%_58%)] hover:text-[hsl(262_83%_68%)]",
            identityPreviewEditButton: "text-[hsl(262_83%_58%)]",
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
      />
    </div>
  );
}
