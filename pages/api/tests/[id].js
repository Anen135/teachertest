import { prisma } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не разрешён' })
  }

  const { id } = req.query

  try {
    const test = await prisma.test.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        questions: {
          select: {
            id: true,
            content: true,
            answers: {
              select: {
                id: true,
                content: true,
              }
            }
          }
        }
      }
    })

    if (!test) {
      return res.status(404).json({ error: 'Тест не найден' })
    }

    res.status(200).json({ test: test })
  } catch (error) {
    console.error('Ошибка получения теста:', error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}
