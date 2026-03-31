export const config = {
  matcher: '/', // Protege apenas o seu painel principal (index.html)
};

export default function middleware(req) {
  // Verifica se o usuário tem o crachá digital no navegador dele
  const authCookie = req.cookies.get('auth_token');

  // Se não tiver o crachá, redireciona a pessoa para a nossa porta de vidro (login.html)
  if (!authCookie || authCookie.value !== 'logado') {
    return Response.redirect(new URL('/login.html', req.url));
  }

  // Se tiver o crachá, a catraca libera a entrada para o sistema
  return new Response(null, { status: 200, headers: { 'x-middleware-next': '1' } });
}