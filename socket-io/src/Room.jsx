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




    }, [conversation, userId])
    // console.log(currentRoom)

    return (
        <div>
            <button onClick={() => setCurrentRoom(conversation)} >{friendUser.email}</button >
            <button >{friendUser._id}</button >
        </div>
    )
}

export default Room