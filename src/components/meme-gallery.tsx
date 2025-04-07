"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"

export function MemeGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const memes = [
    {
      url: "/memes/cat1.jpg",
      caption: "When you finally start a task after procrastinating for 3 hours",
    },
    {
      url: "/memes/cat2.jpg",
      caption: "Me trying to focus on one task while my brain thinks about 37 other things",
    },
    {
      url: "/memes/cat3.jpg",
      caption: "When someone interrupts you right after you finally got in the zone",
    },
    {
      url: "/memes/cat4.jpg",
      caption: "My brain at 3am remembering all the tasks I didn't complete today",
    },
    {
      url: "/memes/cat5.jpg",
      caption: "When you realize the 'quick 5-minute break' turned into 2 hours",
    },
    {
      url: "/memes/cat6.jpg",
      caption: "When you finally complete a task that's been on your list for weeks",
    },
  ]

  const nextMeme = () => {
    setIsLoading(true)
    setCurrentIndex((prev) => (prev + 1) % memes.length)
  }

  const prevMeme = () => {
    setIsLoading(true)
    setCurrentIndex((prev) => (prev - 1 + memes.length) % memes.length)
  }

  const randomMeme = () => {
    setIsLoading(true)
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * memes.length)
    } while (newIndex === currentIndex && memes.length > 1)
    setCurrentIndex(newIndex)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [currentIndex])

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-violet-100 dark:border-violet-900 p-4 shadow-md mb-6 overflow-hidden">
      <h3 className="text-lg font-semibold mb-3 text-center">ADHD Cat Memes</h3>

      <div className="relative aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden mb-3">
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
          )}
        >
          <img
            src={memes[currentIndex].url || "/placeholder.svg"}
            alt="Cat meme"
            className="max-w-full max-h-full object-contain"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
          onClick={prevMeme}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
          onClick={nextMeme}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <p className="text-center font-medium mb-3">{memes[currentIndex].caption}</p>

      <div className="flex justify-center">
        <Button variant="outline" className="flex items-center gap-2" onClick={randomMeme}>
          <Shuffle className="h-4 w-4" />
          Random Cat Meme
        </Button>
      </div>
    </div>
  )
}

