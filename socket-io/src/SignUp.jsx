import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { ActionContext } from './DataContext'
import { Button, Container, Form } from "react-bootstrap"
// import conversation from '../../backend/models/conversation'

function SignUp({ user, setUser, JoinUserRoom, setFriends }) {
    const { conversations, setConversations, messages, setMessages } = useContext(ActionContext)

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [signUpEmail, setSignUpEmail] = useState("")
    const [signUpPassword, setSignUpPassword] = useState("")


    // useEffect(() => {
    //     if (user) {
    //         navigate("/form")
    //     }
    // }, []);

    // const [friends, setFriends] = useState([])


    function Next(id) {

        axios.get(`http://localhost:8000/tasks/${id}`)
            .then(res => {
                console.log(res.data)
                // setUser(res.data.data)
                // setLastCv(res.data.data.cv)

                // setListTasks(res.data.message)
            })
            .catch((err) => console.log(err))
        // console.log(user);
    }

    function SignUpUser(e) {
        e.preventDefault()
        const newUser = { email: signUpEmail, password: signUpPassword }

        axios.post("http://localhost:8000/register", newUser)
            .then((res) => {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("UserId", res.data.data._id)

                console.log(res.data.data);
                // Next(res.data.data._id)
            })
            .catch(err => console.log(err))
    }

    function LoginUser(e) {
        e.preventDefault()
        const newUser = { email: loginEmail, password: loginPassword }

        axios.post("http://localhost:8000/login", newUser)
            .then((res) => {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("UserId", res.data.data._id)

                console.log(res.data.data);
                setUser(res.data.data)
                console.log(res.data);
                setFriends(res.data.allUsers)
                // Next(res.data.data._id)
            })
            .catch(err => console.log(err))
    }
    // function JoinUserRoom(friendUser) {
    //     socket.emit("user-room", user.email, friendUser)
    // }





    return (
        <Container className="border border-dark align-items-center justify-content-center d-flex flex-column shadow w-25 gap-5 p-5 pr-5 pl-5 rounded " >
            <Form onSubmit={SignUpUser} className="w-100 ">
                <Form.Group>
                    <Form.Label className='fs-2'>Sign In</Form.Label>
                    <Form.Control type="text" onChange={(e) => setSignUpEmail(e.target.value)} placeholder="EMAIL" required />
                    <Form.Control className='mt-2' onChange={(e) => setSignUpPassword(e.target.value)} placeholder="PASSWORD" type="text" required />
                </Form.Group>
                <Button type="submit" className="mt-4">SignIn</Button>
                {/* <Button onClick={createNewId} variant="secondary">Create A New Id</Button> */}
            </Form>
            <Form onSubmit={LoginUser} className="w-100">
                <Form.Group>
                    <Form.Label className='fs-2'>Log In</Form.Label>
                    <Form.Control type="text" onChange={(e) => setLoginEmail(e.target.value)} placeholder="EMAIL" required />
                    <Form.Control className='mt-2' onChange={(e) => setLoginPassword(e.target.value)} placeholder="PASSWORD" type="text" required />
                </Form.Group>
                <Button type="submit" className="mt-4">Login</Button>
                {/* <Button onClick={createNewId} variant="secondary">Create A New Id</Button> */}
            </Form>
        </Container>
    )
}

export default SignUp
            // <div className='sign-up'>

            //     <h1>SignIn</h1>
            //     <input onChange={(e) => setSignUpEmail(e.target.value)} placeholder="EMAIL" />
            //     <input onChange={(e) => setSignUpPassword(e.target.value)} placeholder="PASSWORD" />
            //     <button onClick={SignUpUser}>SignUp</button>
            // </div>
            // <div>
            //     <h1>Log In</h1>
            //     <input onChange={(e) => setLoginEmail(e.target.value)} placeholder="EMAIL" />
            //     <input onChange={(e) => setLoginPassword(e.target.value)} placeholder="PASSWORD" />
            //     <button onClick={LoginUser}>Login</button>
            // </div>

            // <div>
                
            // </div>