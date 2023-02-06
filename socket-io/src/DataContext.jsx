import React, { createContext, useState } from 'react'


export const ActionContext = createContext()
function DataContext({ children }) {

    const [conversations, setConversations] = useState([])
    // const [messages, setMessages] = useState([])
    // const [current, setcurrent] = useState([])
    const [currentRoom, setCurrentRoom] = useState({})






    return (
        <ActionContext.Provider value={{ currentRoom, setCurrentRoom, conversations, setConversations, }}>
            {children}
        </ActionContext.Provider>

    )
}

export default DataContext