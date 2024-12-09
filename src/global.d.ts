declare global {
    interface Window {
      SpeechRecognition: typeof SpeechRecognition;
      webkitSpeechRecognition: typeof SpeechRecognition;
    }
  
    interface SpeechRecognition extends EventTarget {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      start(): void;
      stop(): void;
      abort(): void;
      onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
      onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
      onend: ((this: SpeechRecognition, ev: Event) => any) | null;
      onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    }
  
    interface SpeechRecognitionEvent extends Event {
      readonly results: SpeechRecognitionResultList;
    }
  
    interface SpeechRecognitionResultList {
      readonly length: number;
      item(index: number): SpeechRecognitionResult;
      [index: number]: SpeechRecognitionResult;
    }
  
    interface SpeechRecognitionResult {
      readonly isFinal: boolean;
      readonly length: number;
      item(index: number): SpeechRecognitionAlternative;
      [index: number]: SpeechRecognitionAlternative;
    }
  
    interface SpeechRecognitionAlternative {
      readonly transcript: string;
      readonly confidence: number;
    }
  
    interface SpeechRecognitionErrorEvent extends Event {
      readonly error: string;
      readonly message: string;
    }
  }
  
  export {};
  