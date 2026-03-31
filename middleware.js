export const config = {
  matcher: '/', // Protege a página principal do seu sistema
};

export default function middleware(req) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // Aqui estão o seu usuário e a sua senha seguros no servidor
    if (user === 'admin' && pwd === 'TeamGreen26') {
      return new Response(null, { status: 200, headers: { 'x-middleware-next': '1' } });
    }
  }

  // Se não tiver senha ou se a pessoa errar, aciona o bloqueio nativo do navegador
  return new Response('Acesso Negado. Sistema Restrito.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Simulador Atricon 2026"',
    },
  });
}