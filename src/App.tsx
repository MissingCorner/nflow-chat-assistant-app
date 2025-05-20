import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/custom/protected-route";
import { LoginPage } from "@/pages/login";
import { Chat } from "@/pages/chat/chat";
import { ThemeProvider } from "@/contexts/ThemeContext";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="w-full h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <main>
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
