import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не поддерживается' })
  }

  try {
    // Найдём тест по resultId
    const test = await prisma.test.findUnique({
      where: { resultId: id },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
        results: {
          include: {
            responses: true,
          },
        },
      },
    })

    if (!test) {
      return res.status(404).json({ error: 'Тест не найден' })
    }

    // Подготовим данные для вывода
    const structured = {
      testTitle: test.title,
      questions: test.questions.map((q) => ({
        id: q.id,
        content: q.content,
        answers: q.answers,
      })),
      results: test.results.map((result) => ({
        resultId: result.id,
        userId: result.userId,
        responses: result.responses.map((r) => ({
          questionId: r.questionId,
          answer: r.content,
          isCorrect: r.isCorrect,
        })),
      })),
    }

    return res.status(200).json({ success: true, test: structured })
  } catch (err) {
    console.error('Ошибка при получении результатов:', err)
    return res.status(500).json({ error: 'Ошибка сервера' })
  }
}
