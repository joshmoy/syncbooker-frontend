import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/lib/auth";
import { useAuthStore } from "@/store/auth";
import type { 
  RegisterRequest, 
  LoginRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest 
} from "@/types/auth";

export function useRegister() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      setUser(response.user);
      setToken(response.token);
      toast.success(response.message || "Account created successfully!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      setUser(response.user);
      setToken(response.token);
      toast.success(response.message || "Login successful!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();

  return () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password reset link sent to your email.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset link. Please try again.";
      toast.error(message);
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password has been reset successfully.");
      router.push("/login");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password. Please try again.";
      toast.error(message);
    },
  });
}