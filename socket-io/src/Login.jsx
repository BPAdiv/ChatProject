import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';

function Login({ user, setUser, setFriends }) {


    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [signUpEmail, setSignUpEmail] = useState("")
    const [signUpPassword, setSignUpPassword] = useState("")

    const [isVerf, setIsVerf] = useState(true)
    const [alreadYuSE, setAlreadyUse] = useState(false)


    function SignUpUser(e) {
        e.preventDefault()
        const newUser = { email: signUpEmail, password: signUpPassword }

        axios.post("http://localhost:8000/register", newUser)
            .then((res) => {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("UserId", res.data.data._id)

                console.log(res.data.data);
                setUser(res.data.data)
                setFriends(res.data.allUsers)

            })
            .catch(err => err.response.data.alreadyUse && setAlreadyUse(true)
            )
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
            .catch(err => !err.response?.message && setIsVerf(false))
    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>

            <section className="h-100 w-100" style={{ backgroundColor: "#9A616D" }}>

                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-xl-10">
                            <div className="card" style={{ borderRadius: "1rem" }}>
                                <div className="row g-0">
                                    <div className="col-md-6 col-lg-5 d-none d-md-block">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                                            alt="login form" className="img-fluid" style={{ borderRadius: "1rem 0 0 1rem" }} />
                                    </div>
                                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                        <div className="card-body p-4 p-lg-5 text-black">

                                            <form onSubmit={LoginUser}>

                                                <div className="d-flex align-items-center mb-3 pb-1">
                                                    <i className="fas fa-cubes fa-2x me-3" style={{ color: "#ff6219" }}></i>
                                                    <span className="h1 fw-bold mb-0">Logo</span>
                                                </div>

                                                <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>Sign into your account</h5>

                                                <div className="form-outline mb-4">
                                                    <input type="text" id="form2Example17" className="form-control form-control-lg" onChange={(e) => setLoginEmail(e.target.value)} />
                                                    <label className="form-label" htmlFor="form2Example17" >Email address</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <input type="text" id="form2Example27" className="form-control form-control-lg" onChange={(e) => setLoginPassword(e.target.value)} />
                                                    <label className="form-label" htmlFor="form2Example27" >Password</label>
                                                </div>
                                                {!isVerf && <div><p className='text-danger'>email or password not correct</p></div>}
                                                <div className="pt-1 mb-4">
                                                    <button className="btn btn-dark btn-lg btn-block" type="submit">Login</button>
                                                </div>

                                                <a className="small text-muted" href="#!">Forgot password?</a>
                                                <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>Don't have an account? <a href="#!" onClick={handleShow}
                                                    style={{ color: "#393f81" }} class="small" data-toggle="modal" data-target="#modalContactForm">Register here</a></p>
                                                <a href="#!" className="small text-muted">Terms of use.</a>
                                                <a href="#!" className="small text-muted">Privacy policy</a>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign In To Enjoy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={SignUpUser}>
                        <div class="md-form mb-5  " >
                            <i class="fas fa-envelope prefix grey-text"></i>
                            <input type="text" id="form29" class="form-control validate" onChange={(e) => setSignUpEmail(e.target.value)} />
                            <label data-error="wrong" data-success="right" for="form29">Your email</label>
                            {alreadYuSE && <div><p className='text-danger'>Email already in use</p></div>}
                        </div>
                        <div class="md-form mb-5">
                            <i class="fas fa-tag prefix grey-text"></i>
                            <input type="text" id="form32" class="form-control validate" onChange={(e) => setSignUpPassword(e.target.value)} />
                            <label data-error="wrong" data-success="right" for="form32">Your Passsword</label>
                        </div>
                        <div  >
                            <button type='sumbit' className='py-2 border rounded w-100 text-white outline-none' style={{ backgroundColor: "#9A616D" }} >Send </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Login