import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Instantiate GoogleGenAI server-side using environment credentials
  const ai = new GoogleGenAI({});

  // Multi-turn Gemini Chatbot Endpoint with Google Maps Grounding
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Mensagens são obrigatórias.' });
      }

      const systemInstruction = `Você é a Sophia, Corretora Digital e Especialista em Bairros e Imóveis da Morada Digital em Contagem e Grande BH.
Sede da Imobiliária: Bairro Arvoredo (Rua Pinheiro, 264, Contagem-MG).
Responsável Técnico: Daniel Gama (CRECI 68.165-F).
CRECI Jurídico nº 104.900-J.
Canais de atendimento: WhatsApp (31) 98427-9865 e Fixo (31) 3357-3030.

Sua missão:
Atender clientes com empatia, agilidade e excelência técnica, tirando dúvidas sobre imóveis, bairros, infraestrutura e processos de locação e compra.

Você possui integração ativa com o Google Maps (Maps Grounding). Utilize os dados do Google Maps para fornecer informações precisas e atualizadas sobre:
1. Bairros de Contagem (Bairro Arvoredo, Cabral, Eldorado, Nacional, Alvorada, Fonte Grande, Ressaca, Industrial, etc.) e proximidade com Belo Horizonte (como Lagoa da Pampulha e bairros vizinhos como Castelo e Alípio de Melo).
2. Pontos de interesse, distâncias, rotas e acessos (Av. Severino Ballesteros, Av. João César de Oliveira, Via Expressa de Contagem, BR-040, Shopping Contagem, Itaú Power Shopping, Parque Ecológico do Eldorado).
3. Escolas, hospitais, farmácias, supermercados e conveniências nas imediações dos bairros solicitados.

Diferenciais da Morada Digital que você pode apresentar:
- Aluguel Sem Fiador (Garantia Morada Total): Zero depósito caução, análise de crédito ágil em até 2 horas, repasse garantido ao proprietário todo dia 12 e proteção de até R$ 50.000 contra danos.
- Contratos com assinatura eletrônica oficial e total segurança jurídica.
- Assessoria especializada com corretores credenciados.

Diretrizes de resposta:
- Responda em português brasileiro com tom profissional, acolhedor e seguro.
- Use formatação clara com tópicos e negritos para leitura agradável.
- Ao final, se o usuário demonstrar interesse em visitar ou negociar um imóvel, convide-o a falar com a equipe pelo WhatsApp oficial: (31) 98427-9865.`;

      // Format messages history for Gemini API multi-turn format
      const formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Use gemini-3.8-flash with Google Maps grounding tool
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          tools: [{ googleMaps: {} }],
        }
      });

      const replyText = response.text || 'Olá! Estou pronta para te ajudar a encontrar seu imóvel ideal ou tirar dúvidas sobre Contagem e região. Como posso te auxiliar agora?';
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

      return res.json({
        reply: replyText,
        groundingMetadata
      });
    } catch (err: any) {
      console.error('Erro na API de chat Gemini:', err);
      return res.status(500).json({ 
        error: 'Erro ao processar mensagem com o assistente.',
        details: err?.message || 'Erro interno no servidor'
      });
    }
  });

  // Mount Vite middleware in development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Morada Digital Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
