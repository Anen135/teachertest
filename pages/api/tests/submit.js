import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' })
  }

  const { testId, studentName, answers } = req.body

  if (!testId || !studentName || !answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Неверные данные' })
  }

  try {
    // 1. Создаем результат (Result)
    const result = await prisma.result.create({
      data: {
        testId,
        userId: studentName,
      },
    })

    // 2. Загружаем правильные ответы на все вопросы теста
    const questions = await prisma.question.findMany({
      where: { testId },
      include: {
        answers: true,
      },
    })

    // 3. Готовим записи для Response[]
    const responsesData = questions.map((question) => {
      const selectedAnswerId = answers[question.id]
      const selectedAnswer = question.answers.find((a) => a.id === selectedAnswerId)

      return {
        resultId: result.id,
        questionId: question.id,
        content: selectedAnswer?.content || '',
        isCorrect: selectedAnswer?.isCorrect || false,
      }
    })

    // 4. Сохраняем ответы
    await prisma.response.createMany({
      data: responsesData,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Ошибка при сохранении результата:', error)
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
}
