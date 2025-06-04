
"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/modals/modal";
import { login, register, auth, googleProvider, githubProvider } from "@/firebase/config";
import { signInWithPopup } from "firebase/auth";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useFirebaseAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await register(email, password);
      setEmail("");
      setPassword("");
      setError("");
      setIsAuthModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
      setError("");
      setIsAuthModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setError("");
      setIsAuthModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setError("");
      setIsAuthModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold">
          Notes — твои мысли всегда под рукой
        </h1>
        <p className="text-base sm:text-base md:text-base font-medium">
          Приложение для быстрого создания заметок
        </p>
        {isLoading && (
          <div className="w-full flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}
        {isAuthenticated && !isLoading && (
          <Button asChild>
            <Link href="/documents">
              Войти <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        )}
        {!isAuthenticated && !isLoading && (
          <Modal
            trigger={
              <Button>
                Начать <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            }
            title={isSignUp ? "Регистрация" : "Вход"}
            open={isAuthModalOpen}
            onOpenChange={setIsAuthModalOpen}
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
              <Button
                onClick={isSignUp ? handleRegister : handleLogin}
                className="w-full"
              >
                {isSignUp ? "Зарегистрироваться" : "Войти"}
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
              <p className="text-sm text-center">
                {isSignUp ? "Уже зарегистрированы?" : "Нет аккаунта?"}{" "}
                <span
                  className="cursor-pointer hover:underline"
                  onClick={() => setIsSignUp((prev) => !prev)}
                >
                  {isSignUp ? "Войти" : "Зарегистрироваться"}
                </span>
              </p>
            </div>
          </Modal>
        )}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Подробнее о приложении
        </p>
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </div>
    </div>
  );
};