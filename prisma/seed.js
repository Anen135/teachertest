const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getShuffledAnswers(correct) {
  const wrongAnswers = [
    'Неверный ответ 1',
    'Неверный ответ 2',
    'Неверный ответ 3',
  ];

  // Случайная позиция для правильного ответа
  const correctIndex = Math.floor(Math.random() * 4);

  const answers = [];

  let wrongIndex = 0;
  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      answers.push({
        content: correct,
        isCorrect: true,
      });
    } else {
      answers.push({
        content: wrongAnswers[wrongIndex++],
        isCorrect: false,
      });
    }
  }

  return answers;
}

async function main() {
  console.log('🚨 Очистка базы данных...');

  await prisma.response.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.result.deleteMany();
  await prisma.question.deleteMany();
  await prisma.test.deleteMany();

  console.log('✅ Очистка завершена.');

  const testsData = [
    {
      title: 'Тест по истории',
      questions: [
        'Когда началась Первая мировая война?',
        'Кто был первым президентом США?',
        'Год распада СССР?',
        'Как назывался договор, завершивший Вторую мировую?',
        'Какой фараон правил в Египте при строительстве пирамид?',
        'Что такое Великая депрессия?',
      ],
    },
    {
      title: 'Тест по математике',
      questions: [
        'Сколько будет 7 * 8?',
        'Что такое производная функции?',
        'Решите уравнение: x^2 - 4 = 0',
        'Что такое интеграл?',
        'Как найти площадь круга?',
        'Что такое логарифм?',
        'Чему равен синус 90 градусов?',
      ],
    },
    {
      title: 'Тест по географии',
      questions: [
        'Столица Бразилии?',
        'Самая длинная река в мире?',
        'На каком континенте находится Египет?',
        'Где находится гора Эверест?',
        'Какое самое большое озеро в мире?',
      ],
    },
    {
      title: 'Тест по биологии',
      questions: [
        'Что такое ДНК?',
        'Где находится митохондрия?',
        'Что делает красная кровяная клетка?',
        'Какое животное самое быстрое на суше?',
        'Что такое фотосинтез?',
        'Сколько хромосом у человека?',
      ],
    },
    {
      title: 'Тест по литературе',
      questions: [
        'Кто написал «Преступление и наказание»?',
        'Герой романа «Мастер и Маргарита»?',
        'Кто автор «Войны и мира»?',
        'Какой поэт писал о любви к Марине?',
        'Что символизирует черный человек у Есенина?',
      ],
    },
  ];

  console.log(`📦 Создание ${testsData.length} тестов...`);

  for (const test of testsData) {
    const createdTest = await prisma.test.create({
      data: {
        title: test.title,
      },
    });


    for (const questionContent of test.questions) {
      const createdQuestion = await prisma.question.create({
        data: {
          content: questionContent,
          testId: createdTest.id,
        },
      });

      const answers = getShuffledAnswers('Правильный ответ');
      await prisma.answer.createMany({
        data: answers.map((answer) => ({
          ...answer,
          questionId: createdQuestion.id,
        })),
      });

    }

    console.log(`✅ Тест "${test.title}" завершён.\n`);
  }

  console.log('🎉 Все тесты и вопросы с ответами успешно добавлены!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
