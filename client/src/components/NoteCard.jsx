"use client"

import { Link } from "react-router-dom"
import { useState } from "react"
import { notesAPI } from "../services/api"

const NoteCard = ({ note, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = useState(note.isFavorite)
  const [loading, setLoading] = useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      personal: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
      work: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
      ideas:
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
      important: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
      passwords:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
      default: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600",
    }
    return colors[category.toLowerCase()] || colors.default
  }

  const handleFavoriteToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return

    setLoading(true)
    try {
      await notesAPI.toggleFavorite(note._id)
      setIsFavorite(!isFavorite)
      if (onFavoriteToggle) {
        onFavoriteToggle(note._id, !isFavorite)
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative group">
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteToggle}
        disabled={loading}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
          isFavorite
            ? "bg-yellow-500 text-white shadow-lg scale-110"
            : "bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-yellow-500 hover:bg-white dark:hover:bg-gray-700 shadow-md"
        } ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"} backdrop-blur-sm`}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </button>

      <Link to={`/note/${note._id}`} className="block group">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 group-hover:border-blue-200 dark:group-hover:border-blue-600 group-hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4 pr-8">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {note.title}
            </h3>
            <span className={`text-xs px-3 py-1 rounded-full border ${getCategoryColor(note.category)} font-medium`}>
              {note.category}
            </span>
          </div>

          {note.content && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
              {note.content.substring(0, 100)}
              {note.content.length > 100 && "..."}
            </p>
          )}

          {note.images && note.images.length > 0 && (
            <div className="mb-4">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={note.images[0].url || "/placeholder.svg?height=200&width=300"}
                  alt="Note preview"
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {note.images.length > 1 && (
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>+{note.images.length - 1}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z"
                />
              </svg>
              <span>{formatDate(note.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{note.images?.length || 0}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default NoteCard
