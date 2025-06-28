"use client"

import { useState } from "react"

const ExportModal = ({ isOpen, onClose, notes, selectedNotes = [] }) => {
  const [exportFormat, setExportFormat] = useState("json")
  const [exportType, setExportType] = useState("all") // all, selected, filtered
  const [includeImages, setIncludeImages] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      let notesToExport = notes
      if (exportType === "selected" && selectedNotes.length > 0) {
        notesToExport = notes.filter((note) => selectedNotes.includes(note._id))
      }

      if (exportFormat === "json") {
        exportAsJSON(notesToExport)
      } else if (exportFormat === "pdf") {
        await exportAsPDF(notesToExport, includeImages)
      } else if (exportFormat === "txt") {
        exportAsText(notesToExport)
      }
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const exportAsJSON = (notes) => {
    const dataStr = JSON.stringify(notes, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `notes-export-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportAsText = (notes) => {
    let textContent = "# My Notes Export\n\n"
    textContent += `Exported on: ${new Date().toLocaleDateString()}\n`
    textContent += `Total Notes: ${notes.length}\n\n`
    textContent += "=" * 50 + "\n\n"

    notes.forEach((note, index) => {
      textContent += `## ${index + 1}. ${note.title}\n`
      textContent += `**Category:** ${note.category}\n`
      textContent += `**Created:** ${new Date(note.createdAt).toLocaleDateString()}\n`
      textContent += `**Favorite:** ${note.isFavorite ? "Yes" : "No"}\n\n`

      if (note.content) {
        textContent += `**Content:**\n${note.content}\n\n`
      }

      if (note.images && note.images.length > 0) {
        textContent += `**Images:** ${note.images.length} attached\n`
        note.images.forEach((img, imgIndex) => {
          textContent += `  ${imgIndex + 1}. ${img.url}\n`
        })
        textContent += "\n"
      }

      textContent += "-".repeat(50) + "\n\n"
    })

    const dataBlob = new Blob([textContent], { type: "text/plain" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `notes-export-${new Date().toISOString().split("T")[0]}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const loadImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        try {
          const dataURL = canvas.toDataURL("image/jpeg", 0.8)
          resolve(dataURL)
        } catch (error) {
          resolve(url) // Fallback to original URL
        }
      }
      img.onerror = () => resolve(url) // Fallback to original URL
      img.src = url
    })
  }

  const exportAsPDF = async (notes, withImages) => {
    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Notes Export</title>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 40px; 
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #4F46E5;
            }
            .header h1 {
              color: #4F46E5;
              margin: 0;
              font-size: 28px;
            }
            .export-info {
              color: #666;
              font-size: 14px;
              margin-top: 10px;
            }
            .note { 
              margin-bottom: 40px; 
              page-break-inside: avoid; 
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              background: #fafafa;
            }
            .note-title { 
              font-size: 22px; 
              font-weight: bold; 
              color: #1f2937; 
              margin-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
            }
            .note-meta { 
              color: #6b7280; 
              font-size: 13px; 
              margin-bottom: 15px;
              display: flex;
              gap: 20px;
              flex-wrap: wrap;
            }
            .note-meta span {
              background: #e5e7eb;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: 500;
            }
            .note-content { 
              line-height: 1.8; 
              margin-bottom: 20px;
              white-space: pre-wrap;
              background: white;
              padding: 15px;
              border-radius: 6px;
              border-left: 4px solid #4F46E5;
            }
            .note-images {
              margin-top: 20px;
            }
            .note-images h4 {
              color: #374151;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .image-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin-top: 10px;
            }
            .image-item {
              text-align: center;
              page-break-inside: avoid;
            }
            .image-item img {
              max-width: 100%;
              max-height: 300px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border: 1px solid #e5e7eb;
            }
            .image-caption {
              font-size: 12px;
              color: #6b7280;
              margin-top: 5px;
            }
            .note-separator { 
              border-bottom: 1px solid #e5e7eb; 
              margin: 30px 0; 
            }
            .page-break { 
              page-break-before: always; 
            }
            @media print {
              body { margin: 20px; }
              .note { 
                border: 1px solid #ccc; 
                margin-bottom: 30px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📝 My Notes Export</h1>
            <div class="export-info">
              <p>Exported on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Total Notes: ${notes.length} | Images Included: ${withImages ? "Yes" : "No"}</p>
            </div>
          </div>
    `

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i]

      htmlContent += `
        <div class="note">
          <div class="note-title">${note.title}</div>
          <div class="note-meta">
            <span>📁 ${note.category}</span>
            <span>📅 ${new Date(note.createdAt).toLocaleDateString()}</span>
            <span>${note.isFavorite ? "⭐ Favorite" : "📄 Regular"}</span>
            ${note.images && note.images.length > 0 ? `<span>🖼️ ${note.images.length} Images</span>` : ""}
          </div>
          <div class="note-content">${note.content || "No content available"}</div>
      `

      if (withImages && note.images && note.images.length > 0) {
        htmlContent += `
          <div class="note-images">
            <h4>📷 Attached Images:</h4>
            <div class="image-grid">
        `

        for (let j = 0; j < note.images.length; j++) {
          const image = note.images[j]
          try {
            const base64Image = await loadImageAsBase64(image.url)
            htmlContent += `
              <div class="image-item">
                <img src="${base64Image}" alt="Note image ${j + 1}" />
                <div class="image-caption">Image ${j + 1}</div>
              </div>
            `
          } catch (error) {
            htmlContent += `
              <div class="image-item">
                <div style="padding: 20px; background: #f3f4f6; border-radius: 8px; text-align: center; color: #6b7280;">
                  🖼️ Image could not be loaded<br>
                  <small>Original URL: ${image.url}</small>
                </div>
                <div class="image-caption">Image ${j + 1} (Failed to load)</div>
              </div>
            `
          }
        }

        htmlContent += `
            </div>
          </div>
        `
      }

      htmlContent += `</div>`

      // Add page break after every 2 notes for better printing
      if (i > 0 && (i + 1) % 2 === 0 && i < notes.length - 1) {
        htmlContent += `<div class="page-break"></div>`
      }
    }

    htmlContent += `
        </body>
      </html>
    `

    // Create and open print window
    const printWindow = window.open("", "_blank")
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.print()
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Notes
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "json", label: "JSON", icon: "📄", desc: "Complete data backup" },
                { value: "pdf", label: "PDF", icon: "📑", desc: "Printable document" },
                { value: "txt", label: "Text", icon: "📝", desc: "Simple text format" },
              ].map((format) => (
                <button
                  key={format.value}
                  onClick={() => setExportFormat(format.value)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    exportFormat === format.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{format.icon}</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{format.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{format.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* PDF Options */}
          {exportFormat === "pdf" && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                PDF Options
              </h4>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Include Images</span>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Embed images directly in the PDF (larger file size)
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Export Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">What to Export</label>
            <div className="space-y-2">
              {[
                { value: "all", label: `All Notes (${notes.length})`, desc: "Export your entire note collection" },
                {
                  value: "selected",
                  label: `Selected Notes (${selectedNotes.length})`,
                  desc: "Export only selected notes",
                  disabled: selectedNotes.length === 0,
                },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => !type.disabled && setExportType(type.value)}
                  disabled={type.disabled}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                    exportType === type.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                  } ${type.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="font-medium text-gray-800 dark:text-gray-200">{type.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 font-medium flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
