const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Iniciando servidor...');
console.log('Variáveis de ambiente carregadas:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('PORT:', PORT);

app.use(cors());
app.use(express.json());

app.post('/contact', async (req, res) => {
  console.log('Requisição recebida em /contact');
  const { name, email, subject, message } = req.body;
  console.log('Dados recebidos:', { name, email, subject, message });

  if (!name || !email || !subject || !message) {
    console.log('Erro: Campos obrigatórios faltando');
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    console.log('Configurando transporter SMTP...');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('Enviando e-mail para support@cortex5g.fun...');
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'support@cortex5g.fun',
      subject: `[Contato Site] ${subject}`,
      text: message,
      html: `<p><b>Nome:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Assunto:</b> ${subject}</p>
             <p><b>Mensagem:</b><br>${message}</p>`,
    });
    console.log('E-mail enviado com sucesso!');
    res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem.' });
  }
});

app.get('/', (req, res) => {
  console.log('Rota / acessada');
  res.send('Servidor de contato rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 
