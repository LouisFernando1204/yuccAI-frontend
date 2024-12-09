import React, { useState } from 'react';
import axios from 'axios';

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const generateSpeech = async () => {
    if (!text) return alert('Please enter some text.');

    setLoading(true);
    try {
      const apiKey = "sk_d03bf78d4dedcb33a29f461a7e6df0a7e16d1537e0d66197";
      const response = await axios.post(
        'https://api.elevenlabs.io/v1/text-to-speech',
        {
          text: text,
          voice: 'Bella', // You can specify different voices based on Eleven Labs' API
          model_id: 'eleven_monolingual_v1',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          responseType: 'arraybuffer', // Audio data
        }
      );

      // Convert the binary response to a Blob URL
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioUrl(audioURL);
    } catch (error) {
      console.error('Error generating speech:', error);
      alert('Failed to generate speech. Please check your API key and input text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-to-speech">
      <h1>Text to Speech with Eleven Labs</h1>
      <textarea
        placeholder="Enter text here..."
        value={text}
        onChange={handleTextChange}
        rows={5}
        style={{ width: '100%', padding: '10px' }}
      />
      <button onClick={generateSpeech} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Speech'}
      </button>
      {audioUrl && (
        <div>
          <h3>Generated Speech:</h3>
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
