import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { nome, estrelas, pontos, nivel } = req.body;

      if (!nome || estrelas === undefined || pontos === undefined) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
      }

      // Verifica se o jogador já existe
      const { rows: existing } = await sql`
        SELECT * FROM ranking WHERE nome = ${nome} LIMIT 1;
      `;

      if (existing.length > 0) {
        // Atualiza somando estrelas e pontos
        const novoTotalEstrelas = Number(existing[0].estrelas) + Number(estrelas);
        const novoTotalPontos = Number(existing[0].pontos) + Number(pontos);
        const novoNivel = nivel || existing[0].nivel;

        await sql`
          UPDATE ranking
          SET estrelas = ${novoTotalEstrelas}, 
              pontos = ${novoTotalPontos},
              nivel = ${novoNivel}
          WHERE nome = ${nome};
        `;

        return res.status(200).json({ message: 'Pontuação atualizada com sucesso!' });
      } else {
        // Cria novo registro
        await sql`
          INSERT INTO ranking (nome, estrelas, pontos, nivel)
          VALUES (${nome}, ${estrelas}, ${pontos}, ${nivel});
        `;

        return res.status(200).json({ message: 'Jogador adicionado com sucesso!' });
      }
    }

    if (req.method === 'GET') {
      // Retorna Top 10 do ranking (ordenado por pontos)
      const { rows } = await sql`
        SELECT * FROM ranking
        ORDER BY pontos DESC
        LIMIT 10;
      `;
      return res.status(200).json(rows);
    }

    return res.status(405).json({ error: 'Método não permitido.' });
  } catch (error) {
    console.error('Erro no handler /api/ranking:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

