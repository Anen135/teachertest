'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PlusCircle } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900 rounded-2xl p-10 max-w-xl w-full text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-gray-800 dark:text-white mb-4"
        >
          📚 Онлайн Тестирование
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
          Нажмите, чтобы начать создавать:
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block"
        >
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
            Создать тест
          </Link>
        </motion.div>
      </motion.div>
    </main>
  )
}
