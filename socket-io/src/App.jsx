import './App.css';
import { io } from 'socket.io-client'
import { useContext, useEffect, useRef, useState } from 'react';
import SignUp from './SignUp';
import axios from 'axios';
import { ActionContext } from './DataContext';
import Room from './Room';
import Message from './Message';
// Bootstrap CSS
// import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
// import "bootstrap/dist/js/bootstrap.bundle.min";
import { Col, Container, ListGroup, Nav, Row, Tab } from 'react-bootstrap';
import Login from './Login';

const socket = io("http://localhost:2000")

function App() {

  const { currentRoom, setCurrentRoom, conversations, setConversations, } = useContext(ActionContext)
  const [messages, setMessages] = useState([])
  const [ArrivelMessages, setArrivelMessages] = useState({})
  const [isTrue, setIsTrue] = useState(true)
  // const [friends, setFriends] = useState([])
  const [message, setMessage] = useState("")
  const [list, setList] = useState([])
  const [room, setRoom] = useState("")

  const [user, setUser] = useState("")
  const [friends, setFriends] = useState([])
  useEffect(() => {
    setIsTrue(!isTrue)
  }, [messages])


  //token verf
  useEffect(() => {
    const loggedInUser = localStorage.getItem("UserId");
    const loggedInToken = localStorage.getItem("token");
    console.log(loggedInUser);
    console.log(loggedInToken);
    if (loggedInUser && loggedInToken) {
      axios.post("http://localhost:8000/verf", { userId: loggedInUser, token: loggedInToken })
        .then((res) => {
          console.log(res.data);
          setUser(res.data.data);
          setFriends(res.data.allUsers)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [])


  //socket
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected")
    });
    socket.on("getMsg", data => {

      setArrivelMessages({
        sentBy: data.sentBy,
        text: data.text,
        createdAt: data.createdAt
      })
      console.log(data.text)
    })
    return () => {
      socket.off("connect")
      socket.off("getMsg")
    }
  }, [])



  //new msg from socket
  useEffect(() => {
    if (ArrivelMessages) {
      if (currentRoom?.members?.includes(ArrivelMessages.sentBy)) {

        const room = currentRoom;
        currentRoom?.messages?.push(ArrivelMessages)
        setCurrentRoom(room)
        setMessages((prev) => [...prev, ArrivelMessages])
      }
    }
  }, [ArrivelMessages])

  //set messages
  useEffect(() => {
    setMessages(currentRoom.messages)
    console.log("useEfefct ", messages)
  }, [currentRoom])


  //start a conversation
  useEffect(() => {
    if (user) {
      socket.emit("addUser", user._id)

      axios.get(`http://localhost:8000/conversation/${user._id}`)
        .then(res => {
          console.log(res.data);
          setConversations(res.data.data)
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [user])


  //add message to socket and to mongo
  function HandleClick() {
    const msg = {
      sentBy: user._id,
      text: message,
      createdAt: new Date()
    }
    axios.post(`http://localhost:8000/messages/${currentRoom._id}`, msg)
      .then(res => {
        console.log("this is the new message ", res.data.msg)
        const room = currentRoom
        currentRoom.messages.push(res.data.msg)
        setCurrentRoom(room)
        setMessages((prev) => [...prev, res.data.msg])
      })
      .catch(err => console.log(err))
    const recieverId = currentRoom.members.find(mbr => mbr !== user._id)
    socket.emit("send-message", {
      userId: user._id,
      recieveId: recieverId,
      text: message,
      createdAt: new Date()
    })
  }
  //scroll into view
  const scrollRef = useRef()
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])


  function AddConversation(recieveId) {
    axios.post("http://localhost:8000/conversation", { recieveId: recieveId, senderId: user._id })
      .then(res => {
        setConversations((prev) => [...prev, res.data.data])
        setCurrentRoom(res.data.data)
        console.log(res.data.data)
      })
      .catch(err => console.log(err))
  }

  //logut
  function Logout() {
    localStorage.setItem("token", "")
    localStorage.setItem("userId", "")
    setUser("")
    setCurrentRoom("")
    setConversations([])
    setMessages([])
  }

  const [inputSearch, setInputSearch] = useState("")
  const [filterSearch, setFilterSearch] = useState([])

  //search field
  function FilteredFriends(e) {
    setInputSearch(e.target.value)
    if (e.target.value == "") {
      setFilterSearch(friends)
    } else {
      const filterFriends = friends.filter(conv => conv?.email?.includes(e.target.value))
      console.log("this is", filterFriends)
      setFilterSearch([...filterFriends])
    }
  }

  //use stae form who is showeing
  const [whoIsMain, setWhoIsMain] = useState(true)
  const [main, setMain] = useState(false)
  const [drawerIsOpen, setDrawerIsOpen] = useState(false)

  function mainToConv(params) {
    setWhoIsMain(true)
    if (!main) {
      setMain(true)
    }
    if (main && whoIsMain) {
      setMain(false)
    }
  }
  function mainToFriend(params) {

    setWhoIsMain(false)
    if (!main) {
      setMain(true)
    }
    if (main && !whoIsMain) {
      setMain(false)
    }
  }
  return (
    <div className="App">
      {user ?
        <>
          <div className='chat-container'>
            <div className={`sidebar-wrapper  ${main ? "main-width-side" : "mian-width-1"}`}>
              <div>{user.email}</div>
              <div onClick={mainToConv}>
                <img src="/pic/contact.svg" alt="" />
              </div>
              <div onClick={mainToFriend}>
                <img src="/pic/Conv.png" alt="" />
              </div>
              <div onClick={Logout} >
                <img src="/pic/logout.png" alt="" />
              </div>
            </div>
            <div className={`menu-wrapper ${main ? "main-width" : "mian-width-0"}  `} >
              <div className='menu' >

                <div className='menu-conv-btn ' style={whoIsMain ? { display: "none" } : { display: "block" }}>
                  <div className='menu-conv-heading'>

                    <h3>Contacts</h3>
                  </div>
                  <div className='conv--wrapper'>
                    {
                      conversations.length ?
                        conversations.map(conv =>
                          <div onClick={() => setMain(false)} className={`single-conv ${conv._id == currentRoom._id && "focus-btn"}`} eventKey={conv._id}   >
                            <Room conversation={conv} userId={user._id} />
                          </div>

                        ) :
                        <div>No conversations open</div>
                    }
                  </div>
                </div>
                <div className='menu-friends-wrapper' style={!whoIsMain ? { display: "none" } : { display: "block" }} s>
                  <div className='friends' >
                    <div className='friends-heading'>
                      <h6 style={{ marginTop: "20px" }}>Conversation</h6>
                      <input type="text" placeholder='Search Friend ' onChange={FilteredFriends} />
                    </div>
                    <ul className='friend-users' >
                      {
                        inputSearch.length > 0
                          ?
                          filterSearch.filter(frnds =>
                            frnds._id !== user._id)
                            .map(user =>
                              <li action onClick={() => {
                                setMain(false)
                                AddConversation(user._id)
                              }}>{user.email}</li>)
                          :
                          friends.filter(frnds =>
                            frnds._id !== user._id)
                            .map(user =>
                              <li action onClick={() => {
                                setMain(false)
                                AddConversation(user._id)
                              }}>{user.email}</li>)
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className='current-room-wrapper'>
              <div className='current-room-heading'>
                <img onClick={() => setMain(true)} src="/pic/left.png" alt="" />
                {currentRoom.members && <p>{currentRoom?.members[0]}</p>}
              </div>
              <div className='current-room'>
                {
                  currentRoom?.messages?.length ?
                    <>
                      {currentRoom?.messages?.map((msg, index) =>
                        <div
                          className={`single-message `} style={msg.sentBy == user._id ? { alignSelf: "flex-end", alignItems: "flex-end" } : { alignItems: "flex-start" }}>
                          <div ref={scrollRef}  >
                            <Message msg={msg} messages={messages} user={user} />
                          </div>
                        </div>
                      )}
                    </>
                    :
                    <div>No messages</div>
                }
              </div>
              <div className='chat-input'>
                <div className='chat-input-wrapper'>
                  <input type="text" onChange={(e) => setMessage(e.target.value)} placeholder="text" />
                  <button onClick={HandleClick}>Snd</button>
                </div>
              </div>
            </div>
          </div>
        </>
        :
        <>
          <Login
            user={user}
            setUser={setUser}
            setFriends={setFriends} />
        </>
      }
    </div >
  );
}

export default App;
