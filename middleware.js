export const config = {
  matcher: '/', // Protege apenas o seu painel principal
};

export default function middleware(req) {
  // Pega todos os cookies que o navegador enviou no cabeçalho
  const cookies = req.headers.get('cookie') || '';

  // Verifica se o nosso crachá (auth_token=logado) está no meio deles
  if (!cookies.includes('auth_token=logado')) {
    // Se não tiver, manda para a tela de login
    return Response.redirect(new URL('/login.html', req.url));
  }

  // Se tiver o crachá, libera a entrada no sistema
  return new Response(null, {
    status: 200,
    headers: {
      'x-middleware-next': '1'
    }
  });
}