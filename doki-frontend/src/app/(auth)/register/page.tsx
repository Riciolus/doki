import { AuthShell } from "@/components/auth-form";

export default function RegisterPage() {
  return <AuthShell mode="register" />;
}

export const metadata = {
  title: "Create account | Dōki",
  description: "Create your Dōki workspace.",
};
