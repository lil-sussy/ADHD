import { TodoApp } from "@/components/todo-app"
import { NameSelector } from "@/components/name-selector"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50 dark:from-violet-950 dark:via-pink-950 dark:to-amber-950 p-4 md:p-6">
      <div className="container mx-auto">
        <NameSelector />
        <TodoApp />
      </div>
    </main>
  )
}

