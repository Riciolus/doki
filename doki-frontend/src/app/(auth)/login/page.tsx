import { AuthShell } from "@/components/auth-form";

export default function RegisterPage() {
  return <AuthShell mode="login" />;
}

export const metadata = {
  title: "Create account | Dōki",
  description: "Create your Dōki workspace.",
};
