import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core';
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";

import { db, auth } from "../firebase";
import 'firebase/compat/auth';
import Posts from './Posts';
import AddPost from './AddPost';
import { Edit } from '@material-ui/icons';

function getModalStyle() {
    return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const Home = () => {

    const classes = useStyles()
    const [modalStyle] = useState(getModalStyle)

    const [openSignup, setOpenSignup] = useState(false)
    const [openSignin, setOpenSignin] = useState(false)

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [user, setUser] = useState(null);

    const [posts, setPosts] = useState([]);

    const signIn = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
            .catch((e) => alert(e.message))

        setOpenSignin(false)

    }

    const signUp = (e) => {
        e.preventDefault()
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username,
                })
            })
            .catch((e) => alert(e.message));

        setOpenSignup(false)
    };

    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser)
            }
            else {
                setUser(null)
            }
        });

        return () => {
            unsubscribe()
        };
    }, [user, username])

    useEffect(() => {
        db.collection("posts")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                setPosts(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        post: doc.data(),
                    }))
                );
            });
    }, []);

    return (
        <div className='app'>

            <Modal open={openSignup} onClose={() => { setOpenSignup(false) }}>
                <div style={modalStyle} className={classes.paper}>
                    <form className='app_signup'>
                        <center>
                            <img
                                className='app__headerImage'
                                src='https://freepngimg.com/save/69662-instagram-media-brand-social-logo-photography/1200x627'
                                alt='logo'
                                width={180}
                                height={100}
                            />
                        </center>
                        <br />
                        <br />
                        <Input
                            placeholder='Name'
                            type='text'
                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                        />
                        <br />
                        <br />
                        <Input
                            placeholder='Email'
                            type='text'
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                        <br />
                        <br />
                        <Input
                            placeholder='Password'
                            type='password'
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                        <br />
                        <br />
                        <Button onClick={signUp} type='submit'>Sign Up</Button>
                    </form>
                </div>
            </Modal>

            <Modal open={openSignin} onClose={() => { setOpenSignin(false) }}>
                <div style={modalStyle} className={classes.paper}>
                    <form className='app_signup'>
                        <center>
                            <img
                                className='app__headerImage'
                                src='https://freepngimg.com/save/69662-instagram-media-brand-social-logo-photography/1200x627'
                                alt='logo'
                                width={180}
                                height={100}
                            />
                        </center>
                        <br />
                        <br />
                        <Input
                            placeholder='Email'
                            type='text'
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                        <br />
                        <br />
                        <Input
                            placeholder='Password'
                            type='password'
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                        <br />
                        <br />
                        <Button onClick={signIn} type='submit'>Sign In</Button>
                    </form>
                </div>
            </Modal>

            <div className='app__header'>
                <img
                    className='app__headerImage'
                    src='https://freepngimg.com/save/69662-instagram-media-brand-social-logo-photography/1200x627'
                    alt='logo'
                    width={180}
                    height={100}
                />

                <div>
                    {user ? <>
                        <div style={{display: 'flex'}}>
                            <h3 style={{margin: '15px'}}>{user.displayName}</h3>
                            <Button variant='contained' color='primary' onClick={() => { auth.signOut() }}>Logout</Button>
                        </div>
                    </>
                        : <>
                            <Button variant='contained' color='primary' onClick={() => { setOpenSignin(true) }}>Sign In</Button>
                            <span>&nbsp;&nbsp;</span>
                            <Button variant='contained' color='primary' onClick={() => { setOpenSignup(true) }}>Sign Up</Button>
                        </>
                    }
                </div>
            </div>
            {user && user.displayName ? <>
                <AddPost username={user.displayName} />
            </> :
                <>
                    <div className='unauth'>
                        Please <b onClick={() => setOpenSignin(true)} style={{ cursor: 'pointer', color: 'Blue' }}>Login</b>/<b onClick={() => setOpenSignup(true)} style={{ cursor: 'pointer', color: 'Blue' }}>Register</b> to Add New Post
                    </div>
                </>}

            {
                <div className="app__posts">
                    <div className="app__postright">
                        {/* {user && user.displayName && <h2 style={{ textAlign: ' center' }}>userid: {user.displayName}</h2>} */}
                        <br />
                        {posts.map(({ id, post }) => (
                            <Posts
                                key={id}
                                postId={id}
                                user={user} //current login person
                                userName={post.userName} //posted person
                                caption={post.caption}
                                imageURL={post.imageURL}
                            />
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}

export default Home