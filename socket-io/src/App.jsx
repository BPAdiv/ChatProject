import './App.css';
import { io } from 'socket.io-client'
import { useContext, useEffect, useRef, useState } from 'react';
import SignUp from './SignUp';
import axios from 'axios';
import { ActionContext } from './DataContext';
import Room from './Room';
import Message from './Message';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Col, Container, ListGroup, Nav, Row, Tab } from 'react-bootstrap';

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

  useEffect(() => {
    const loggedInUser = localStorage.getItem("UserId");
    const loggedInToken = localStorage.getItem("token");
    console.log(loggedInUser);
    console.log(loggedInToken);
    if (loggedInUser && loggedInToken) {
      axios.post("http://localhost:8000/verf", { userId: loggedInUser, token: loggedInToken })
        .then((res) => {
          // localStorage.setItem("token", res.data.token)
          // localStorage.setItem("UserId", res.data.data._id)

          console.log(res.data);
          // Next(res.data.data._id)
          setUser(res.data.data);
          setFriends(res.data.allUsers)
          // setLastCv(res.data.data.cv)
          // navigate("/form")
        })
        .catch(err => {
          // navigate("/")
          console.log(err)
        })
      //   const foundUser = JSON.parse(loggedInUser);
    }
  }, [])
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected")
    });
    socket.on("getMsg", data => {

      setArrivelMessages({
        sentBy: data.sentBy,
        text: data.text
      })
      console.log(data.text)
    })
    return () => {
      socket.off("connect")
      socket.off("getMsg")
    }
  }, [])

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




  // const [messages, setMessages] = useState([])
  useEffect(() => {
    setMessages(currentRoom.messages)
    console.log("useEfefct ", messages)
  }, [currentRoom])

  useEffect(() => {


    if (user) {
      socket.emit("addUser", user._id)

      axios.get(`http://localhost:8000/conversation/${user._id}`)
        .then(res => {
          console.log(res.data);
          setConversations(res.data.data)
          // setFriends(res.data.allUsers)
          // console.log(res.data.allUsers)
          // setMessages(res.data.data.messages)
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [user])



  function JoinUserRoom(friendUser) {
    const names = [user.email, friendUser]
    const Nroom = names.sort().toString()
    // console.log(room);
    socket.emit("user-room", Nroom)
    setCurrentRoom(Nroom)
    // console.log();
  }


  function HandleClick() {
    const msg = {
      sentBy: user._id,
      text: message
    }

    axios.post(`http://localhost:8000/messages/${currentRoom._id}`, msg)
      .then(res => {
        console.log("this is the new message ", res.data.msg)
        const room = currentRoom
        currentRoom.messages.push(res.data.msg)
        setCurrentRoom(room)
        setMessages((prev) => [...prev, res.data.msg])

        // setMessages([...messages, res.data.msg])
      })
      .catch(err => console.log(err))
    const recieverId = currentRoom.members.find(mbr => mbr !== user._id)
    // console.log(currentRoom);
    socket.emit("send-message", {
      userId: user._id,
      recieveId: recieverId,
      text: message

    })
    // AddMsg(message)
  }
  function AddMsg(msg) {
    setList((prev) => [...prev, msg])
  }
  function HandleRoom() {
    socket.emit("join-room", room, (roomid) => {
      AddMsg(`join room ${roomid}`)
    })
  }
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
  function Logout() {
    localStorage.setItem("token", "")
    localStorage.setItem("userId", "")
    setUser("")
    setCurrentRoom("")
    setConversations([])
    setMessages([])
  }
  return (
    <div className="App">
      {/* <div>

        {friends?.map(user =>
          <button>"adad</button>
        )}
      </div> */}
      {user ?
        <><div>
          <button onClick={Logout}>Logout</button>
        </div>
          {/* <ListGroup variant="flush">
            {friends.map(user => (
              <ListGroup.Item key={user._id}>
                {user.email}
              </ListGroup.Item>
            ))}
          </ListGroup> */}
          <div>
            {friends.map(user =>
              <button onClick={() => AddConversation(user._id)}>{user.email}</button>)}
          </div>
          <div>
            <input type="text" onChange={(e) => setMessage(e.target.value)} />

            <button onClick={HandleClick}>Snd</button>
          </div>
          <div >

            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    {conversations.map(conv =>
                      <Nav.Item>
                        <Nav.Link eventKey={conv._id}>
                          <Room conversation={conv} userId={user._id} />
                        </Nav.Link>
                      </Nav.Item>

                    )}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content className='overflow-auto' style={{ height: "50vh" }}>
                    <div className=' d-flex flex-column align-items-start justify-content-end px-3'>
                      {currentRoom?.messages?.map((msg, index) =>

                        <Tab.Pane eventKey={currentRoom._id} className={`my-1 d-flex flex-column ${msg.sentBy == user._id ? 'align-self-end align-items-end' : 'align-items-start'}`}>
                          {/* <Sonnet /> */}
                          <div ref={scrollRef} >
                            <Message msg={msg} messages={messages} user={user} />
                          </div>
                        </Tab.Pane>
                      )}
                    </div>

                    {/* 
            <Tab.Pane eventKey="first">
              <Sonnet />
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <Sonnet />
            </Tab.Pane> */}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>



            {/* {conversations.map(conv =>
              <Room conversation={conv} userId={user._id} />
            )} */}
          </div>

          {/* <div>
            {currentRoom?.messages?.map((msg, index) =>
              <div ref={scrollRef}>
                <Message msg={msg} messages={messages} />
              </div>
            )}

          </div> */}
        </>
        :
        <Container className="align-items-center d-flex justify-content-center " style={{ height: '100vh' }}>
          <SignUp user={user} setUser={setUser} JoinUserRoom={JoinUserRoom} setFriends={setFriends} />
        </Container>

      }

    </div>
  );
}

export default App;
