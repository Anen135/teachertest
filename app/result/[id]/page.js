'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  BarChart2,
  BarChart3,
  CircleX,
  Search,
  Users,
  ListTodo,
  CheckCircle2,
  TrendingUp,
  Medal,
  Award,
  User,
  HelpCircle
} from 'lucide-react'

export default function TestResultsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openIndex, setOpenIndex] = useState(null)
  const [search, setSearch] = useState('')
  const params = useParams()
  const resultId = params.id

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/results/${resultId}`)
        const json = await res.json()

        if (!res.ok) throw new Error(json.error || 'Ошибка загрузки')
        setData(json.test)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [resultId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-slate-900 dark:text-blue-400 text-xl">
        Загрузка результатов...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 dark:text-red-400 text-xl">
        Ошибка: {error}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-400 text-xl">
        Нет данных
      </div>
    )
  }

  const filteredResults = data.results.filter((r) =>
    (r.userId || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-950 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white text-center flex items-center justify-center gap-2">
          <BarChart3 className="w-8 h-8" /> Результаты: {data.testTitle}
        </h1>

        <div className="relative">
          <Search className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по имени..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-md"
        >
          <button
            onClick={() => setOpenIndex(openIndex === 'summary' ? null : 'summary')}
            className="w-full flex justify-between items-center px-6 py-4 text-left"
          >
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <BarChart2 /> Общая статистика по вопросам
            </h2>
            {openIndex === 'summary' ? (
              <ChevronUp className="text-gray-500" />
            ) : (
              <ChevronDown className="text-gray-500" />
            )}
          </button>

          {openIndex === 'summary' && (
            <div className="border-t border-slate-300 dark:border-slate-600 px-6 py-4 space-y-6">
              {(() => {
                const allResults = data.results
                const allResponses = allResults.flatMap((r) => r.responses)
                const totalResponses = allResponses.length
                const correctResponses = allResponses.filter((r) => r.isCorrect).length
                const studentsCount = allResults.length

                const studentStats = allResults.map((r) => {
                  const correct = r.responses.filter((resp) => resp.isCorrect).length
                  const total = r.responses.length
                  const percent = total > 0 ? (correct / total) * 100 : 0
                  return {
                    name: r.userId || 'Без имени',
                    correct,
                    total,
                    percent: Math.round(percent),
                  }
                })

                const avgAccuracy = studentsCount > 0
                  ? Math.round(
                      studentStats.reduce((sum, s) => sum + s.percent, 0) / studentsCount
                    )
                  : 0

                const bestStudent = studentStats.reduce(
                  (best, curr) => (curr.percent > best.percent ? curr : best),
                  studentStats[0] || { name: '', percent: 0 }
                )

                const worstStudent = studentStats.reduce(
                  (worst, curr) => (curr.percent < worst.percent ? curr : worst),
                  studentStats[0] || { name: '', percent: 0 }
                )

                return (
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-xl grid gap-3">
                    <p className="text-gray-800 dark:text-gray-100 font-medium flex items-center gap-2">
                      <Users /> Ответивших учеников: <span className="font-semibold">{studentsCount}</span>
                    </p>
                    <p className="text-gray-800 dark:text-gray-100 font-medium flex items-center gap-2">
                      <ListTodo /> Всего ответов: <span className="font-semibold">{totalResponses}</span>
                    </p>
                    <p className="text-gray-800 dark:text-gray-100 font-medium flex items-center gap-2">
                      <CheckCircle2 /> Правильных ответов: <span className="font-semibold">{correctResponses}</span> (
                      {totalResponses > 0 ? Math.round((correctResponses / totalResponses) * 100) : 0}%)
                    </p>
                    <p className="text-gray-800 dark:text-gray-100 font-medium flex items-center gap-2">
                      <TrendingUp /> Средняя точность по ученикам:{' '}
                      <span className="font-semibold">{avgAccuracy}%</span>
                    </p>
                    <p className="text-gray-800 dark:text-gray-100 font-medium flex items-center gap-2">
                      <Medal /> Лучший результат: <span className="font-semibold">{bestStudent.name}</span> — {bestStudent.percent}%
                    </p>
                    <p className="text-gray-800 dark:text-gray-100 font-medium flex items-center gap-2">
                      <Award /> Худший результат: <span className="font-semibold">{worstStudent.name}</span> — {worstStudent.percent}%
                    </p>
                  </div>
                )
              })()}

              <div className="space-y-4">
                {data.questions.map((question) => {
                  const allResponses = data.results.flatMap((r) => r.responses)
                  const relevant = allResponses.filter((r) => r.questionId === question.id)
                  const correct = relevant.filter((r) => r.isCorrect).length
                  const total = relevant.length
                  const percent = total > 0 ? Math.round((correct / total) * 100) : 0

                  return (
                    <div
                      key={question.id}
                      className="bg-white dark:bg-gray-700 p-4 rounded-xl space-y-1"
                    >
                      <p className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <HelpCircle /> {question.content}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Ответов: {total} • Правильных: {correct} ({percent}%)
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>

        {filteredResults.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Участников не найдено.
          </p>
        ) : (
          <div className="space-y-6">
            {filteredResults.map((result, i) => {
              const correctCount = result.responses.filter((r) => r.isCorrect).length
              const total = result.responses.length
              const percent = Math.round((correctCount / total) * 100)

              return (
                <motion.div
                  key={result.resultId}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex justify-between items-center p-6 text-left"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        <User /> {result.userId || `Без имени #${i + 1}`}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Верных ответов: {correctCount}/{total} ({percent}%)
                      </p>
                    </div>
                    {openIndex === i ? (
                      <ChevronUp className="text-gray-500" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </button>

                  {openIndex === i && (
                    <div className="border-t border-gray-200 dark:border-gray-700 px-6 pb-6 space-y-4">
                      {result.responses.map((response) => {
                        const question = data.questions.find(
                          (q) => q.id === response.questionId
                        )
                        return (
                          <div
                            key={response.questionId + response.answer}
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2"
                          >
                            <p className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                              <HelpCircle /> {question?.content}
                            </p>
                            <p
                              className={`p-2 rounded-md font-medium flex items-center gap-2 ${
                                response.isCorrect
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}
                            >
                              Ответ: {response.answer} {response.isCorrect ? <CheckCircle2/> : <CircleX />}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </main>
  )
}
