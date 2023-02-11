import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { ActionContext } from './DataContext'

function Room({ conversation, userId }) {
    const { currentRoom, setCurrentRoom, conversations, setConversations, messages, setMessages } = useContext(ActionContext)

    const [friendUser, setFriendUser] = useState({})
    useEffect(() => {
        const friendId = conversation.members.find(user =>
            user !== userId
        )
        axios.get(`http://localhost:8000/friend/${friendId}`)
            .then(res => {
                console.log(res.data)
                setFriendUser(res.data.data)
            })
            .catch(err => {
                console.log(err)
            })
        console.log(conversation)
    }, [conversation, userId])

    return (
        <div onClick={() => setCurrentRoom(conversation)}>
            <div  >{friendUser.email}   :<span>{conversation?.messages[conversation?.messages?.length - 1]?.text}</span></div >
        </div>
    )
}

export default Room