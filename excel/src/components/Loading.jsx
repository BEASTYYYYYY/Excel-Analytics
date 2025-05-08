import { useState, useEffect } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'

export default function Loading() {
    const [progress, setProgress] = useState(0)
    const [loadingSteps, setLoadingSteps] = useState([
        { id: 1, text: 'Connecting to server', complete: false },
        { id: 2, text: 'Fetching user data', complete: false },
        { id: 3, text: 'Processing information', complete: false },
        { id: 4, text: 'Preparing dashboard', complete: false }
    ])
    const [fact, setFact] = useState('Did you know? The first computer bug was an actual real-life moth.')

    const facts = [
        'Did you know? The first computer bug was an actual real-life moth.',
        'The average person spends 6 months of their lifetime waiting on red lights.',
        "The world's first website is still online today.",
        'Around 70% of all code is written in spaces, not tabs.',
        'The first computer mouse was made of wood.'
    ]

    useEffect(() => {
        // Simulate loading progress
        const timer = setInterval(() => {
            setProgress(oldProgress => {
                if (oldProgress >= 100) {
                    clearInterval(timer)
                    return 100
                }
                return Math.min(oldProgress + 2, 100)
            })
        }, 150)

        // Update loading steps
        const stepTimer = setInterval(() => {
            setLoadingSteps(steps => {
                const nextIncomplete = steps.findIndex(step => !step.complete)
                if (nextIncomplete === -1) {
                    clearInterval(stepTimer)
                    return steps
                }

                return steps.map((step, i) =>
                    i === nextIncomplete ? { ...step, complete: true } : step
                )
            })
        }, 1500)

        // Change facts every 4 seconds
        const factTimer = setInterval(() => {
            setFact(facts[Math.floor(Math.random() * facts.length)])
        }, 4000)

        return () => {
            clearInterval(timer)
            clearInterval(stepTimer)
            clearInterval(factTimer)
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white text-2xl font-bold">
                                {Math.round(progress)}%
                            </div>
                        </div>
                        <div className="absolute inset-0">
                            <svg className="w-24 h-24" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.8)"
                                    strokeWidth="8"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (251.2 * progress) / 100}
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-white text-2xl font-bold mt-6">Loading your experience</h2>
                    <p className="text-white/70 text-sm mt-2 text-center">Please wait while we prepare everything for you</p>
                </div>

                <div className="space-y-4 mb-6">
                    {loadingSteps.map(step => (
                        <div key={step.id} className="flex items-center gap-3">
                            {step.complete ? (
                                <CheckCircle2 className="text-green-400 w-5 h-5" />
                            ) : (
                                <Loader2 className={`w-5 h-5 ${step.id === loadingSteps.findIndex(s => !s.complete) + 1 ? 'text-white animate-spin' : 'text-white/40'}`} />
                            )}
                            <span className={`${step.complete ? 'text-white' : step.id === loadingSteps.findIndex(s => !s.complete) + 1 ? 'text-white' : 'text-white/40'}`}>
                                {step.text}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 rounded-lg p-4 text-center">
                    <p className="text-white/80 text-sm italic">{fact}</p>
                </div>

                <div className="w-full bg-white/10 h-1.5 rounded-full mt-6">
                    <div
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}