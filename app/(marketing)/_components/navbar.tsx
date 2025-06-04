
"use client";

import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { login, logout, register, auth, googleProvider, githubProvider } from "@/firebase/config";
import { signInWithPopup, AuthError } from "firebase/auth";
import { useState } from "react";
import { Modal } from "@/components/modals/modal";

export const Navbar = () => {
  const { isAuthenticated, isLoading, user } = useFirebaseAuth();
  const scrolled = useScrollTop();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
      setError("");
      setIsSignInOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleRegister = async () => {
    try {
      await register(email, password);
      setEmail("");
      setPassword("");
      setError("");
      setIsSignUpOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setError("");
      setIsSignInOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      setError("");
      setIsSignInOpen(false);
    } catch (err: unknown) {
      const error = err as AuthError;
      if (error.code === "auth/account-exists-with-different-credential") {
        setError(
          "Этот email уже используется другим способом входа. Попробуйте войти через Google или email."
        );
      } else {
        setError(error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div
      className={cn(
        "z-50 bg-white dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <Modal
              trigger={
                <Button variant="ghost" size="sm">
                  Войти
                </Button>
              }
              title="Вход"
              open={isSignInOpen}
              onOpenChange={setIsSignInOpen}
            >
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
                />
                <Button onClick={handleLogin} className="w-full">
                  Войти
                </Button>
                {error && <span className="text-red-500 text-sm">{error}</span>}
                <div className="flex flex-col gap-y-2">
                  <Button
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.29-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                    Войти через Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGithubSignIn}
                    className="w-full flex items-center justify-center gap-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.33.615-4.035-1.455-4.035-1.455-.54-1.365-1.32-1.725-1.32-1.725-1.08-.735.081-.72.081-.72 1.195.075 1.83 1.23 1.83 1.23 1.065 1.815 2.805 1.29 3.495.99.105-.78.42-1.29.765-1.59-2.67-.285-5.475-1.335-5.475-5.925 0-1.305.465-2.385 1.23-3.225-.12-.285-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23a11.79 11.79 0 013.03-.405c1.02 0 2.055.135 3.03.405 2.295-1.545 3.3-1.23 3.3-1.23.66 1.65.24 2.895.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.825 1.095.825 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z"
                      />
                    </svg>
                    Войти через GitHub
                  </Button>
                </div>
              </div>
            </Modal>
            <Modal
              trigger={
                <Button size="sm">
                  Зарегистрироваться
                </Button>
              }
              title="Регистрация"
              open={isSignUpOpen}
              onOpenChange={setIsSignUpOpen}
            >
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
                />
                {error && <span className="text-red-500 text-sm">{error}</span>}
                <Button onClick={handleRegister} className="w-full">
                  Зарегистрироваться
                </Button>
              </div>
            </Modal>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Link href="/documents">
              <Button variant="ghost" size="sm">
                Войти в Notes
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Выйти
            </Button>
            <span className="mr-2">{user?.email}</span>
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};