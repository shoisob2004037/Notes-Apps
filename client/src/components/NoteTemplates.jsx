"use client"

import { useState } from "react"

const NoteTemplates = ({ isOpen, onClose, onSelectTemplate }) => {
  const templates = [
    {
      id: "meeting",
      name: "Meeting Notes",
      icon: "👥",
      category: "Work",
      content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** 
**Agenda:**

## Discussion Points
- 

## Action Items
- [ ] 
- [ ] 

## Next Steps
- 

## Notes
`,
    },
    {
      id: "daily-journal",
      name: "Daily Journal",
      icon: "📔",
      category: "Personal",
      content: `# Daily Journal - ${new Date().toLocaleDateString()}

## Today's Highlights
- 

## Mood: 😊

## Gratitude
- 
- 
- 

## Tomorrow's Goals
- 
- 

## Reflection
`,
    },
    {
      id: "project-plan",
      name: "Project Planning",
      icon: "📋",
      category: "Work",
      content: `# Project Plan

**Project Name:** 
**Start Date:** ${new Date().toLocaleDateString()}
**Deadline:** 

## Objectives
- 

## Milestones
- [ ] 
- [ ] 
- [ ] 

## Resources Needed
- 

## Risks & Mitigation
- 

## Success Criteria
- 
`,
    },
    {
      id: "book-review",
      name: "Book Review",
      icon: "📚",
      category: "Personal",
      content: `# Book Review

**Title:** 
**Author:** 
**Rating:** ⭐⭐⭐⭐⭐
**Date Finished:** ${new Date().toLocaleDateString()}

## Summary


## Key Takeaways
- 
- 
- 

## Favorite Quotes
> 

## Would I Recommend?
Yes/No - 

## Notes
`,
    },
    {
      id: "recipe",
      name: "Recipe",
      icon: "🍳",
      category: "Personal",
      content: `# Recipe Name

**Prep Time:** 
**Cook Time:** 
**Servings:** 
**Difficulty:** Easy/Medium/Hard

## Ingredients
- 
- 
- 

## Instructions
1. 
2. 
3. 

## Notes
- 

## Rating: ⭐⭐⭐⭐⭐
`,
    },
    {
      id: "travel-plan",
      name: "Travel Planning",
      icon: "✈️",
      category: "Personal",
      content: `# Travel Plan

**Destination:** 
**Dates:** 
**Budget:** 

## Itinerary
### Day 1
- 

### Day 2
- 

## Packing List
- [ ] 
- [ ] 
- [ ] 

## Important Info
- **Hotel:** 
- **Flight:** 
- **Emergency Contacts:** 

## Places to Visit
- 
- 

## Local Food to Try
- 
`,
    },
    {
      id: "workout",
      name: "Workout Log",
      icon: "💪",
      category: "Personal",
      content: `# Workout Log - ${new Date().toLocaleDateString()}

**Duration:** 
**Type:** Cardio/Strength/Mixed

## Exercises
### Exercise 1
- Sets: 
- Reps: 
- Weight: 

### Exercise 2
- Sets: 
- Reps: 
- Weight: 

## Notes
- How I felt: 
- Energy level: 
- Next time: 

## Progress Photos
(Add photos here)
`,
    },
    {
      id: "idea-brainstorm",
      name: "Idea Brainstorming",
      icon: "💡",
      category: "Ideas",
      content: `# Brainstorming Session

**Topic:** 
**Date:** ${new Date().toLocaleDateString()}

## Initial Thoughts
- 

## Ideas
1. 
2. 
3. 
4. 
5. 

## Best Ideas ⭐
- 

## Next Steps
- [ ] 
- [ ] 

## Resources/Research Needed
- 
`,
    },
  ]

  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredTemplates = templates.filter(
    (template) => selectedCategory === "all" || template.category.toLowerCase() === selectedCategory.toLowerCase(),
  )

  const categories = ["all", ...new Set(templates.map((t) => t.category.toLowerCase()))]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Choose a Template
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Category Filter */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-white text-purple-600"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {category === "all" ? "All Templates" : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left group"
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{template.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{template.category}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 bg-white dark:bg-gray-600 rounded-lg p-3 font-mono leading-relaxed max-h-32 overflow-hidden">
                  {template.content.substring(0, 150)}...
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteTemplates
