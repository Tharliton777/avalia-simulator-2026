export default function handler(req, res) {
  // Confere se o login.html está mandando dados pra cá
  if (req.method === 'POST') {
    const { senha } = req.body;

    // Aqui fica a sua senha secreta guardada a sete chaves no servidor
    if (senha === '@Assesi2026') {
      // Se acertou, criamos o "crachá digital" (Cookie) válido por 8 horas (28800 segundos)
      res.setHeader('Set-Cookie', 'auth_token=logado; Path=/; Max-Age=28800');
      return res.status(200).json({ mensagem: 'Login com sucesso!' });
    } else {
      // Se errou a senha, devolvemos um erro 401 (Não Autorizado)
      return res.status(401).json({ erro: 'Senha incorreta' });
    }
  }

  // Se tentarem acessar esse arquivo de outra forma, bloqueia
  return res.status(405).json({ erro: 'Método não permitido' });
}