import * as React from "react";
import type { ChatCompletionResponseMessage } from 'openai';
import { Configuration, OpenAIApi } from 'openai';
import { useEffect, useState } from "react";

export function ChatGPT({ apikey, prompt, persona }: { apikey: string | undefined, prompt: string, persona: string }) {
  const person = persona;
  const initMessages: Array<ChatCompletionResponseMessage> =
    [
      {
        role: 'system',
        content: `Answer every question like you are ${person}`
      }
    ]
  const [messages, setMessages] = useState<Array<ChatCompletionResponseMessage>>(initMessages)
  const [chatMessages, setChatMessages] = useState<Array<ChatCompletionResponseMessage>>(initMessages)

  const configuration = new Configuration({
    apiKey: apikey
  });
  const openai = new OpenAIApi(configuration);

  async function callGPT() {
    return await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      messages: [
        ...messages,
        { role: 'user', content: prompt }
      ],
    });
  }

  useEffect(() => {
    if (prompt) {
      callGPT().then(r => {
        console.log(r.data);
        if (r.data.choices[0].message) {
          setMessages([...messages, { role: 'user', content: prompt }, r.data.choices[0].message]);
          setChatMessages([{ role: 'user', content: prompt }, r.data.choices[0].message, ...chatMessages]);
        }
      })
    }
  }, [prompt]);

  useEffect(() => {
    setMessages(initMessages)
    setChatMessages(initMessages)
  }, [persona]);

  return (

    <>
      {chatMessages.map((message) => {
        return (
          <div className="border-4 border-white" key={message.content}>
            <p className="text-lg text-slate-600">{message.role === 'system' || message.role === 'user' ? 'User:' : person}</p>
            <p className="text-xl">{message.content}</p>
          </div>
        )
      })}
    </>
  );
}
