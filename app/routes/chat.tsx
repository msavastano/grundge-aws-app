import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { ChangeEvent, } from "react";
import { useState } from "react";
import { ChatGPT } from "~/components/ChatGPT";

export async function loader({ params, request }: LoaderArgs) {
  const apikey = process.env.OPENAI_API_KEY;
  return json({ apikey });
}

export default function NoteIndexPage() {
  const data = useLoaderData<typeof loader>();
  const [prompt, setPrompt] = useState('');
  const [promptSend, setPromptSend] = useState('');
  const [persona, setPersona] = useState('');
  const [personaSend, setPersonaSend] = useState('');

  const handlePromptChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value)
    e.preventDefault()
  }

  const handleSend = () => {
    setPromptSend(prompt)
    setPrompt('')
  }

  const handlePersonaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPersona(e.target.value)
    e.preventDefault()
  }

  const handlePersonaSet = () => {
    setPersonaSend(persona)
    setPersona('')
  }

  return (
    <div className="m-10">
      <p className="text-xl">Refresh browser or set a persona to clear context</p>
      <div>
        <div className="flex m-2">
          <input
            value={persona}
            onChange={handlePersonaChange}
            id="persona"
            name="persona"
            type="text"
            placeholder="ChatGPT Persona?"
            className="input-bordered input-primary input mr-1"
          />
          <button className="btn btn-primary" onClick={handlePersonaSet}>
            Set
          </button>
        </div>
      </div>
      {personaSend &&
        <div>
          <div className="flex justify-between m-2">
            <input
              value={prompt}
              onChange={handlePromptChange}
              id="search"
              name="search"
              type="text"
              placeholder="Chat"
              className="input-bordered input-primary input w-full mr-1"
            />
            <button className="btn btn-primary" onClick={handleSend}>
              Send
            </button>
          </div>
          <ChatGPT apikey={data.apikey} prompt={promptSend} persona={personaSend} />
        </div>
      }
    </div>
  );
}
