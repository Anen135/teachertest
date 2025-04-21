'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { LoaderCircle, CheckCircle } from 'lucide-react'

export default function TakeTestPage() {
  const { id } = useParams()
  const [test, setTest] = useState(null)
  const [name, setName] = useState('')
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fetchTest = async () => {
      const res = await fetch(`/api/tests/${id}`)
      const data = await res.json()
      setTest(data.test)
    }

    fetchTest()
  }, [id])

  const handleSelect = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId,
    })
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Введите имя')
      return
    }

    const res = await fetch('/api/tests/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testId: id,
        studentName: name,
        answers,
      }),
    })

    const data = await res.json()
    if (data.success) {
      setSubmitted(true)
    } else {
      alert('Ошибка при отправке')
    }
  }

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900">
        <LoaderCircle className="animate-spin w-8 h-8 text-blue-600" />
        <p className="mt-4 text-lg">Загрузка теста...</p>
      </div>
    )
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto p-6 text-center bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg rounded-2xl mt-10"
      >
        <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Тест отправлен!</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Спасибо, {name}! Результаты отправлены учителю.
        </p>
      </motion.div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900 rounded-2xl p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{test.title}</h1>

        <input
          type="text"
          placeholder="Введите ваше имя"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {test.questions.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4"
          >
            <p className="font-semibold text-gray-800 dark:text-white mb-2">{q.content}</p>
            <div className="space-y-2">
              {q.answers.map((a) => (
                <label
                  key={a.id}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                    answers[q.id] === a.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === a.id}
                    onChange={() => handleSelect(q.id, a.id)}
                    className="accent-blue-600"
                  />
                  <span>{a.content}</span>
                </label>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
        >
          Отправить ответы
        </motion.button>
      </motion.div>
    </main>
  )
}
