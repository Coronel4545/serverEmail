const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

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

    res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar mensagem.' });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor de contato rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 