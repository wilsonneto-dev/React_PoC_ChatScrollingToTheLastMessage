import { useEffect, useRef, useState } from 'react';
import mock_messages from './mock-data';
import style from "./chat.module.scss";

interface message { id: number, from: string, msg: string }

const Chat = () => {
  const [messages, setMessages] = useState<message[]>([mock_messages[0]]);
  const messagesComponent = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(add_mock_message, 3_000)
    return () => clearTimeout(timer)
  }, [messages])

  useEffect(() => 
    messagesComponent.current?.scrollTo({ top: messagesComponent.current?.scrollHeight, behavior: 'smooth' })
    , [messages])

  const add_mock_message = () => add_message(mock_messages[messages.length % mock_messages.length]) 
  
  const add_message = ({ msg, from }: { msg: string, from: string }): void => 
    setMessages(state => [...state, { from, msg, id: Math.floor(Math.random() * 10_000) }])

  return (
    <section className={style.chat}>
      <Header />
  
      <div className={ style.messages } ref={ messagesComponent }>
        { messages.map(({ id, msg, from }) => <Message key={ id } from={ from }>{ msg }</Message>) }
      </div>
  
      <MessageInput onSendMessage={ (message: string) => add_message({msg: message, from: "user" }) } />
    </section>
  )
}

const MessageInput = ({ onSendMessage }: { onSendMessage: (message: string) => void }) => {
  const [input, setInput] = useState("")
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() 
    setInput("")
    onSendMessage(input)
  }
  
  return <form onSubmit={ onSubmit }>
    <input value={ input } onChange={ e => setInput(e.target.value) } />
    <button>Send</button>
  </form>
}

const Header = () => {
  return <header>
    <div className={style.bar}>Support Chat</div>
  </header>
}

const Message = ({ from, children }: { from: string, children: React.ReactNode }) => 
  <div className={`${style.message} ${from == "user" ? style.user : ""}`}>
    {children}
  </div>

export default Chat;