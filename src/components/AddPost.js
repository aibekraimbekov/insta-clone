import React, { useState } from 'react';
import { storage, db } from "../firebase"
import { TextField, Button } from '@material-ui/core'
import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import 'firebase/compat/storage';

const AddPost = ({ username }) => {

    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)

    const [image, setImage] = useState(null)

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageURL: url,
                            userName: username
                        })
                    })

            }
        )
        setCaption(' ')
        setImage(null)
    }

    return (
        <div className="imagesupload">
            <h2 style={{ textAlign: 'center', margin: '15px' }}>Add New Post</h2>
            <br/>
            <input className='file-input' type="file" onChange={handleChange} />
            <br/>
            <TextField id="filled-basic" label="Caption here" variant="filled" onChange={event => setCaption(event.target.value)} value={caption} />
            <br/>
            <progress className="progress" value={progress} max="100" />
            <br/>
            <Button variant="contained" color='primary' onClick={handleUpload}>
                ADD POST
            </Button>
        </div>
    )
}

export default AddPost