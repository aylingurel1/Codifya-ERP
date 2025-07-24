"use client";

import { useEffect, useState } from "react";

export default function TestToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@test.com",
          password: "password",
        }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleTestAPI = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/finance/v1/banks/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Token Test Page</h1>

      <div className="mb-4">
        <strong>Current Token:</strong>
        <div className="text-sm bg-gray-100 p-2 mt-2 break-all">
          {token || "No token found"}
        </div>
      </div>

      <div className="space-x-4">
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login & Set Token
        </button>

        <button
          onClick={handleTestAPI}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test API
        </button>
      </div>
    </div>
  );
}
