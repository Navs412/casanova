'use client';

import { useState, useCallback, useRef } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = useCallback(() => {
    const win = window as any;
    if (!win.webkitSpeechRecognition && !win.SpeechRecognition) {
      alert('Voice input is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const results = event.results;
      let transcript = '';
      for (let i = 0; i < results.length; i++) {
        transcript += results[i][0].transcript;
      }
      onTranscript(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  }, [isListening, onTranscript]);

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={`
        p-2.5 rounded-full transition-all duration-150
        ${isListening
          ? 'bg-casanova-accent text-white animate-pulse'
          : 'text-casanova-muted hover:text-casanova-accent hover:bg-casanova-accent-soft'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={isListening ? 'Stop listening' : 'Voice input (transcribes on-device, never transmits audio)'}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
}
