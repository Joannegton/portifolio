import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navigation } from "@/components/Navegacao";
import { FloatingParticles } from "@/components/particulasFlutuantes";
import { Footer } from "@/components/footer";
import { ScrollProgresso } from "@/components/scrollProgresso";
import { ThemeProvider } from "@/components/themeProvider";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Wellington Tavares Galbarini - Desenvolvedor Full Stack & Professor",
  description:
    "Desenvolvedor Full Stack, Professor, Palestrante e Criador de Projetos com Foco em Tecnologia e Matemática",
  keywords: [
    "desenvolvedor",
    "professor",
    "full stack",
    "tecnologia",
    "Joannegton",
    "matemática",
    "programação",
    "educação",
  ],
  authors: [{ name: "Wellington Tavares Galbarini", url: "https://github.com/joannegton" }],
  creator: "Joannegton",
  publisher: "Joannegton",
  openGraph: {
    title: "Wellington Tavares Galbarini - Desenvolvedor Full Stack & Professor",
    description:
      "Professor, Desenvolvedor Full Stack, Palestrante e Criador de Projetos com Foco em Tecnologia e Matemática",
    type: "website",
    locale: "pt_BR",
    siteName: "Joannegton - Portfólio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wellington Tavares Galbarini - Desenvolvedor Full Stack & Professor",
    description:
      "Professor, Desenvolvedor Full Stack, Palestrante e Criador de Projetos com Foco em Tecnologia e Matemática",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={inter.className}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background relative">
            <ScrollProgresso />
            <FloatingParticles />
            <Navigation />
            <main className="pt-20">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
