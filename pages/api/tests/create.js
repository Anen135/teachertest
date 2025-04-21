import { prisma } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, questions } = req.body;

    // Validate the input data
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ error: 'Title and questions are required' });
    }

    try {
      // Create the test in the database
      const test = await prisma.test.create({
        data: {
          title,
          questions: {
            create: questions.map((question) => ({
              content: question.content,
              answers: {
                create: question.answers.map((answer) => ({
                  content: answer.content,
                  isCorrect: answer.isCorrect,
                })),
              },
            })),
          },
        },
      });

      // Return the created test
      return res.status(200).json({ test });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create the test' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
