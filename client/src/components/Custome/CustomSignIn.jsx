// src/components/CustomSignIn.jsx
import { SignIn } from "@clerk/clerk-react";

const CustomSignIn = ({ onClose }) => {
  return (
    <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
      appearance={{
        elements: {
          footerAction: "Developed by Boni Amin Jayed(37)", // এখানে তুমি তোমার নাম দিতে পারো
        },
      }}
    />
  );
};

export default CustomSignIn;
