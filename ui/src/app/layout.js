import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/context/UserContext";
import { Red_Hat_Display } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const redHat = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // adjust weights as needed
  variable: "--font-red-hat",
  display: "swap",
});

export const metadata = {
  title: " Revisions Checklist Portal",
  description:
    "A portal to manage, track, and complete web design revision checklists efficiently.",
  icons: {
    icon: "/fav-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true} data-lt-installed={true}>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={` ${redHat.variable} antialiased`}
      >
        <UserProvider>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{
              zIndex: 9999,
              marginTop: "60px",
              marginBottom: "20px",
            }}
          />
          {children}
        </UserProvider>{" "}
      </body>
    </html>
  );
}
