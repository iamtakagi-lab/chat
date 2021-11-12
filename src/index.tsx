import React from 'react';
import { render } from 'react-dom';
import { ToastProvider, useToasts } from "react-toast-notifications"
import { FormEvent, useEffect, useState } from "react"
import { db } from "./db"
import { Message } from "./types"
import './index.scss'
import { RealtimeSubscription, SupabaseRealtimePayload } from '@supabase/supabase-js';

const Chat: React.FC<{}> = () => {
    const { addToast } = useToasts();
    const [nickname, setNickname] = useState("")
    const [text, setText] = useState("")

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (text.length) {
            db.from<Message>('messages').insert({
                nickname: nickname.length ? nickname : "名無しさん", text
            }).then(({ data, error, status }) => {
                if (error || !data) return addToast(`チャット送信失敗`, { appearance: 'error', autoDismiss: true })
                addToast(`チャット送信完了`, { appearance: 'success', autoDismiss: true })
            })
        }
    }

    return (
        <>
            <form className="flex inline" method="PUT" onSubmit={(e) => { submit(e) }}>
                <input
                    className="form-input mt-1 block w-full border-solid border-2 rounded-md"
                    value={nickname}
                    maxLength={64}
                    placeholder="ニックネーム"
                    onChange={(event) => setNickname(event.target.value)}
                />
                <input
                    className="form-input mt-1 block w-full border-solid border-2 rounded-md"
                    value={text}
                    required={true}
                    maxLength={100}
                    placeholder="テキスト"
                    onChange={(event) => setText(event.target.value)}
                />
                <button type="submit" className="ml-2 
                transition duration-500 
                ease-in-out whitespace-nowrap block items-center justify-center border border-transparent 
                px-3 py-3 my-1 rounded-full shadow-sm text-base font-medium 
                text-white bg-blue-500 hover:bg-transparent hover:border-blue-500 hover:text-blue-500">送信</button>
            </form>
        </>
    )
}

const Message: React.FC<{ message: Message }> = ({ message }) => {
    return (
        <div className="border-b py-2">
            <p>{message.id}</p>
            <p>{message.created_at}</p>
            <p>{message.nickname}</p>
            <p>{message.text}</p>
        </div>
    )
}

const Messages: React.FC<{}> = ({ }) => {
    const { addToast } = useToasts();
    const [messages, setMessages] = useState<Message[]>([])

    let subscription: RealtimeSubscription | null = null;

    const handleNewMessage = (payload: SupabaseRealtimePayload<Message>) => {
        setMessages((prevMessages) => [payload.new, ...prevMessages]);
    }

    const getInitialMessages = () => {
        if (!messages.length) {
            db.from<Message>('messages').select('*').limit(50).order("id", { ascending: false }).then(({ data, status, error }) => {
                if (error || !data) {
                    if (subscription) {
                        db.removeSubscription(subscription);
                        subscription = null
                    }
                    return addToast(`チャット取得失敗`, { appearance: 'error', autoDismiss: true })
                }
                setMessages(data)
            })
        }
    }

    const getMessagesAndSubscribe = async () => {
        if (!subscription) {
            getInitialMessages()
            subscription = db
                .from<Message>("messages")
                .on("*", (payload) => {
                    handleNewMessage(payload);
                })
                .subscribe();
        }
    };

    useEffect(() => {
        getMessagesAndSubscribe()

        return () => {
            if (subscription) {
                db.removeSubscription(subscription);
                subscription = null
            }
        }
    }, [])

    return (
        <>
            {messages &&
                messages.map((message, i) => {
                    return (
                        <Message key={i} message={message} />
                    )
                })
            }
        </>
    )
}

export const App: React.FC<{}> = ({ }) => {
    return (
        <ToastProvider>
            <main className="container md:w-1/3 py-32" >
                <a href="/">
                    <div className="text-center my-3 text-lg cursor-pointer">
                        chat
                    </div>
                </a>
                <div className="text-center my-3 text-md">
                    チャットするやつ
                </div>
                <section>
                    <Chat />
                </section>
                <section>
                    <Messages />
                </section>
            </main>
        </ToastProvider>
    )
}

render(<App />, document.getElementById('app'))