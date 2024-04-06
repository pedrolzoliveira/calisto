import { env } from '@/src/config/env';

interface Params { email: string, token: string }

export function passwordRecovery({ email, token }: Params) {
  return (
`Olá ${email.split('@').at(0) as string},<br>
<br>
Recebemos uma solicitação para redefinir sua senha. Se você não fez essa solicitação, por favor, ignore este e-mail. Caso contrário, você pode redefinir sua senha usando o link abaixo:<br>
<br>
<a href="${env.SERVER_URL}/users/password-recovery/${token}">Clique aqui para redefinir sua senha</a><br>
<br>
Este link de redefinição de senha expirará em 24 horas.<br>
<br>
Se você precisar de mais assistência, entre em contato com nosso suporte ao cliente em <a href="mailto:contact@lightbeam.news">contact@lightbeam.news</a>.<br>
<br>
Atenciosamente,<br>
<br>
Light Beam News<br>
Equipe de Suporte ao Cliente<br>
<br>`
  );
}
