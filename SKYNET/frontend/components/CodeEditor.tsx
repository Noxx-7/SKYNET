'use client'

import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { useStore } from '@/lib/store'
import { Play, Save, Share2, FileUp, BarChart3 } from 'lucide-react'
import CodeAnalysisSidebar from './CodeAnalysisSidebar'

export default function CodeEditor() {
  const [code, setCode] = useState('# Your LLM SDK code here\n\nclass MyLLMModel:\n    def __init__(self):\n        self.name = "my-custom-model"\n    \n    def generate(self, prompt: str) -> str:\n        # Implement your model logic\n        return f"Response to: {prompt}"')
  const [isRunning, setIsRunning] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [optimizedCode, setOptimizedCode] = useState<string | null>(null)
  const [showOptimizedModal, setShowOptimizedModal] = useState(false)
  const editorRef = useRef<any>(null)

  const handleRun = async () => {
    setIsRunning(true)
    try {
      console.log('Running code...')
    } catch (error) {
      console.error('Execution error:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCode(content)
      }
      reader.readAsText(file)
    }
  }

  const handleOptimize = async () => {
    try {
      const response = await fetch('http://localhost:8000/code/generate-optimized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: 'python' })
      })

      if (response.ok) {
        const data = await response.json()
        setOptimizedCode(data.optimized_code)
        setShowOptimizedModal(true)
      }
    } catch (err) {
      console.error('Error optimizing code:', err)
    }
  }

  const applyOptimizedCode = () => {
    if (optimizedCode) {
      setCode(optimizedCode)
      setShowOptimizedModal(false)
      setOptimizedCode(null)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg h-full flex">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Code Editor</h2>
            <div className="flex space-x-2">
              <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
                <FileUp className="w-4 h-4 mr-2" />
                Upload
                <input
                  type="file"
                  accept=".py,.js,.ts,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showAnalysis
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analysis
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run'}
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={(editor) => (editorRef.current = editor)}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {showAnalysis && (
          <div className="w-96 flex-shrink-0">
            <CodeAnalysisSidebar code={code} onOptimize={handleOptimize} />
          </div>
        )}
      </div>

      {showOptimizedModal && optimizedCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Optimized Code</h3>
              <p className="text-sm text-gray-500 mt-1">
                Review the optimized version and apply if you like it
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm whitespace-pre-wrap font-mono">{optimizedCode}</pre>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowOptimizedModal(false)
                  setOptimizedCode(null)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={applyOptimizedCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Optimized Code
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
