'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Trash2, PlusCircle, CheckCircle, Copy, CopyCheck, ExternalLink, Check, X, LoaderCircle } from 'lucide-react'
import { NavigationConfirm } from '@/components/NavigationConfirm'

export default function CreateTestPage() {
  const [title, setTitle] = useState('')
  const [testLink, setTestLink] = useState('');
  const [resultLink, setResultLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [resultLinkCopied, setResultLinkCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([
    {
      content: '',
      answers: [
        { content: '', isCorrect: true },
        { content: '', isCorrect: false },
      ],
    },
  ])
  const router = useRouter() 

  

  const handleQuestionChange = (index, value) => {
    const updated = [...questions]
    updated[index].content = value
    setQuestions(updated)
  }

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updated = [...questions]
    updated[qIndex].answers[aIndex].content = value
    setQuestions(updated)
  }

  const handleCorrectToggle = (qIndex, aIndex) => {
    const updated = [...questions]
    updated[qIndex].answers = updated[qIndex].answers.map((a, i) => ({
      ...a,
      isCorrect: i === aIndex,
    }))
    setQuestions(updated)
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        content: '',
        answers: [
          { content: '', isCorrect: true },
          { content: '', isCorrect: false },
        ],
      },
    ])
  }

  const removeQuestion = (index) => {
    const updated = [...questions]
    updated.splice(index, 1)
    setQuestions(updated)
  }

  const addAnswer = (qIndex) => {
    const updated = [...questions]
    updated[qIndex].answers.push({ content: '', isCorrect: false })
    setQuestions(updated)
  }

  const removeAnswer = (qIndex, aIndex) => {
    const updated = [...questions]
    updated[qIndex].answers.splice(aIndex, 1)
    setQuestions(updated)
  }

  useEffect(() => {
    console.log("isLoading changed:", isLoading);
  }, [isLoading]);

  const handleSubmit = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
        const res = await fetch('/api/tests/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, questions }),
        })
        const data = await res.json()
  
        if (data?.test?.id) {
          const link = `${window.location.origin}/test/${data.test.id}`
          const resultLink = `${window.location.origin}/result/${data.test.resultId}`
          setTestLink(link)
          setResultLink(resultLink)
        } else {
          alert('Ошибка при создании теста')
        }
      } catch (error) {
        console.error('Ошибка:', error)
        alert('Произошла ошибка при отправке')
      } finally {
        setIsLoading(false) 
    }
  }

  // Проверка на заполнение обязательных полей
  const isFormValid = title && questions.every(q => q.content !== '');

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Подтверждение навигации */}
        <Suspense fallback={null}> <NavigationConfirm message="Вы уверены, что хотите выйти? Несохраненные данные будут потеряны." /> </Suspense>
        {/* Блики */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />
        
        {/* Содержимое страницы */}
        <main className="p-6 max-w-4xl mx-auto space-y-6">
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl space-y-6"
        >
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            📝 Создание Теста
            </h1>

            <input
            className={`w-full p-3 rounded-lg border ${title ? 'border-gray-300 dark:border-gray-700' : 'border-blue-200'} dark:bg-gray-800 dark:text-white`}
            type="text"
            placeholder="Название теста"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />

            {questions.map((q, qIndex) => (
            <div
                key={qIndex}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow space-y-4"
            >
                <div className="flex items-center justify-between">
                <input
                    className={`w-full p-2 rounded-lg border ${q.content ? 'border-gray-300 dark:border-gray-600' : 'border-blue-200'} dark:bg-gray-700 dark:text-white`}
                    type="text"
                    placeholder={`Вопрос ${qIndex + 1}`}
                    value={q.content}
                    onChange={(e) =>
                    handleQuestionChange(qIndex, e.target.value)
                    }
                />
                <button
                    onClick={() => removeQuestion(qIndex)}
                    className="ml-4 text-red-500 hover:text-red-700"
                >
                    <Trash2 />
                </button>
                </div>

                {q.answers.map((a, aIndex) => (
                <div
                  key={aIndex}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 w-full mx-auto"
                >
                  <input
                    className="w-full sm:flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    type="text"
                    placeholder={`Ответ ${aIndex + 1}`}
                    value={a.content}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, aIndex, e.target.value)
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCorrectToggle(qIndex, aIndex)}
                      className={`p-1 sm:p-2 rounded-full ${
                        a.isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <CheckCircle className="" />
                    </button>
                    <button
                      onClick={() => removeAnswer(qIndex, aIndex)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              
                ))}

                <button
                onClick={() => addAnswer(qIndex)}
                className="text-blue-500 hover:underline text-sm mt-2"
                >
                + Добавить ответ
                </button>
            </div>
            ))}

            <button
            onClick={addQuestion}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
            <PlusCircle />
            Добавить вопрос
            </button>

            <button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className={`w-full mt-6 py-3 rounded-xl ${(isFormValid && !isLoading) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-semibold shadow`}
            >
            {isLoading 
              ? <div className='flex items-center justify-center gap-2'><LoaderCircle className="animate-spin" /> Создание теста...</div>
              : isFormValid 
                ? <div className='flex items-center justify-center gap-2'><Check  color='#70ff88' /> Создать тест</div>
                : <div className='flex items-center justify-center gap-2'><X/> Создать тест</div>
            }

            </button>
            {testLink && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl text-center">
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                Ссылка на тест:
                </p>
                <div className="flex items-center justify-center gap-2">
                    <input
                        type="text"
                        readOnly
                        value={testLink}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white w-3/4"
                    />
                    <div>
                        <button
                            onClick={() => {navigator.clipboard.writeText(testLink); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000);}}
                            className="text-blue-600 hover:text-blue-800 px-2"
                        >
                            {linkCopied ? <CopyCheck color='#70ff88' /> : <Copy />}
                        </button>
                        <button
                            onClick={() => { router.push(testLink); }}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <ExternalLink />
                        </button>
                    </div>
                </div>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                Ссылка на результаты:
                </p>
                <div className="flex items-center justify-center gap-2">
                    <input
                        type="text"
                        readOnly
                        value={resultLink}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white w-3/4"
                    />
                    <div>
                        <button
                            onClick={() => {navigator.clipboard.writeText(resultLink); setResultLinkCopied(true); setTimeout(() => setResultLinkCopied(false), 2000);}}
                            className="text-blue-600 hover:text-blue-800 px-2"
                        >
                            {resultLinkCopied ? <CopyCheck color='#70ff88' /> : <Copy />}
                        </button>
                        <button
                            onClick={() => { router.push(resultLink); }}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <ExternalLink />
                        </button>
                    </div>
                </div>
            </div>
            )}

        </motion.div>
        </main>
    </div>
  )
}
