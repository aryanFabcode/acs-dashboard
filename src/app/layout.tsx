"use client"
import { Outfit } from "next/font/google";
import "./globals.css";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { store } from "@/lib/redux/store";
import { Provider } from "react-redux";
import AuthGuard from "@/components/protection/routeGuard";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${outfit.variable} dark:bg-gray-900`}>
        <ThemeProvider>
          <Provider store={store}>
            <AuthGuard>
              <SidebarProvider>{children}</SidebarProvider>
            </AuthGuard>
          </Provider>
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            limit={3}
            closeButton={false}
            icon={true}
            className="toast-container"
            toastClassName={({ type }) =>
              `relative flex p-4 mb-3 rounded-lg shadow-lg overflow-hidden cursor-pointer ${type === 'success' ? 'bg-emerald-600' :
                type === 'error' ? 'bg-rose-600' :
                  type === 'info' ? 'bg-sky-600' :
                    type === 'warning' ? 'bg-amber-600' : 'bg-slate-700'
              } font-outfit-sans font-medium text-white text-sm`
            }
            bodyClassName="ml-2 w-full"
            progressClassName={({ type }) =>
              `Toastify__progress-bar Toastify__progress-bar--animated ${type === 'success' ? 'bg-emerald-400' :
                type === 'error' ? 'bg-rose-400' :
                  type === 'info' ? 'bg-sky-400' :
                    type === 'warning' ? 'bg-amber-400' : 'bg-slate-400'
              }`
            }
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
