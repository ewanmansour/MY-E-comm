import React, { useState } from 'react';
import { askAssistant } from '../lib/api';

const initialMessages = [
  {
    role: 'assistant',
    text: 'Hi, I can help you choose products, sizes, outfits, and gifts.',
  },
];

const AiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await askAssistant(text, nextMessages);
      setMessages([...nextMessages, { role: 'assistant', text: reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          text: 'I cannot reach the assistant server right now. Start the backend and try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed bottom-5 right-5 z-50'>
      {open && (
        <div className='mb-3 w-[min(92vw,360px)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl'>
          <div className='flex items-center justify-between border-b px-4 py-3'>
            <div>
              <p className='text-sm font-semibold text-gray-900'>AI Shopping Assistant</p>
              <p className='text-xs text-gray-500'>Product help in seconds</p>
            </div>
            <button
              type='button'
              onClick={() => setOpen(false)}
              className='h-8 w-8 rounded-full border text-sm text-gray-600 hover:bg-gray-100'
              aria-label='Close assistant'
            >
              X
            </button>
          </div>

          <div className='flex max-h-80 flex-col gap-3 overflow-y-auto bg-gray-50 px-4 py-4'>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-5 ${
                  message.role === 'user'
                    ? 'ml-auto bg-black text-white'
                    : 'border border-gray-200 bg-white text-gray-700'
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className='w-fit rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500'>
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className='flex gap-2 border-t bg-white p-3'>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className='min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black'
              placeholder='Ask about products'
            />
            <button
              type='submit'
              className='rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:bg-gray-300'
              disabled={loading}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type='button'
        onClick={() => setOpen((value) => !value)}
        className='h-14 w-14 rounded-full bg-black text-sm font-semibold text-white shadow-xl hover:bg-gray-800'
        aria-label='Open AI assistant'
      >
        AI
      </button>
    </div>
  );
};

export default AiAssistant;
