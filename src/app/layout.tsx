import './globals.css';

export const metadata = {
  title: 'Curioso',
  description: 'Painel central de controle rodando na VM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
