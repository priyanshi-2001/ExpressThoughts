import React from 'react'
import { useState,useEffect } from 'react';
import { Button, Modal ,Input} from '@mui/material';
import moment from 'moment'
import {Image, Video, Transformation,CloudinaryContext} from 'cloudinary-react';
import Snackbar from '@mui/material/Snackbar';

// const url="http://localhost:8000/";
const url='https://djnago-myblogs-site.onrender.com/';

const Landing = () => {
  const [data,setData]=useState([]);
  const[commentsData,setCommentsData]=useState([]);
  const[showLikesPopup,setShowLikesPopup]=useState(false);
  const[showCommentsPopup,setShowCommentsPopup]=useState(false);
  const[postId,setPostId]=useState('');
  const[likesData,setLikesData]=useState([]);
  const[newComment,setNewComment]=useState('');
  const[page,setPage]=useState(1);
  const token=localStorage.getItem("token");
  const [isSnackbarMsg,setIsSnackbarMsg]=useState('');
  const[isSnackbar,setIsSnackBar]=useState(false);

  useEffect(() => {
    if (isSnackbar) {
      const timeout = setTimeout(() =>  setIsSnackBar(false), 5000);//means after 5s disappers
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isSnackbar]);

  useEffect(()=>{
    (async()=>{

      if(showLikesPopup){
      await getLikesData();
      }

    })()

  },[showLikesPopup])

  useEffect(()=>{
 
   if(page>1){
    (async()=>{
      await getData();

    })()
   }
    

  },[page])

  useEffect(()=>{
    (async()=>{
      if(showCommentsPopup){
      await fetchComments();
      }

    })()

  },[showCommentsPopup])

  useEffect(()=>{

    (async()=>{
      await getData();

    })()

  },[])

  const addreaction=async()=>{
    const resp=await fetch(url+'addLike/',{
      headers:{
        'Content-Type':'application/json',
        Authorization: `Token ${token}`,
      },
      method:'POST',
      body:JSON.stringify({
        blogId:postId,
        userId:localStorage.getItem("userId")
      })
    })
    const response=await resp.json()
    if(response.Error=='NA'){
      setLikesData(prevData => prevData.concat(response.Status));
    }
    if(response.Error=='Auth Failed'){
      window.location='/login';
     }
     if(response.Error=='Already Liked'){
      setIsSnackBar(true);
      setIsSnackbarMsg("Already Liked!!")

     }
  }
  const addComments=async()=>{
    const resp=await fetch(url+'addComment/',{
      headers:{
        'Content-Type':'application/json',
        Authorization: `Token ${token}`,
      },
      method:'POST',
      body:JSON.stringify({
        blogId:postId,
        description:newComment

      })
    })
    const response=await resp.json()
    if(response.Error=='NA'){
     setCommentsData(prevData => prevData.concat(response.Status));
    }
    if(response.Error=='Auth Failed'){
      window.location='/login';
     }
  }

  const getData=async()=>{
    try{
    
      const resp=await fetch(url+`getBlogsData/?page=${page}`,{
        headers:{
          'Content-Type':'application/json',
          Authorization: `Token ${token}`,
        },
        method:'GET'
      })
      const response=await resp.json()
      if(response.Error=='NA'){
        if(data.length>0){
          setData(prevData => prevData.concat(response.data));          
      }
      else{
        setData( response.data );
      }
       
      }
      if(response.Error=='Auth Failed'){
        window.location='/login';
       }
    }
    catch(err){
      console.log("err",err);
    }
  }

  const getLikesData=async()=>{
    const resp=await fetch(url+`getLikes/?blogId=${postId}`,{
      headers:{
        'Content-Type':'application/json',
        Authorization: `Token ${token}`,
      },
      method:'GET'
    })
    const response=await resp.json()
    if(response.Error=='NA'){
     setLikesData( response.Status);
    }
    if(response.Error=='Auth Failed'){
      window.location='/login';
     }
  }

  const fetchComments=async()=>{
    try{
      const resp=await fetch(url+`getComments/?blogId=${postId}`,{
        headers:{
          'Content-Type':'application/json',
          Authorization: `Token ${token}`,
        },
        method:'GET'
      })
      const response=await resp.json()
      if(response.Error=='NA'){
       setCommentsData( response.Status);
      }
      if(response.Error=='Auth Failed'){
        window.location='/login';
       }

    }
    catch(err){
      console.log("error is",err);
    }
  }

  const logout=async()=>{
    try{
      const resp=await fetch(url+`logout/`,{
        headers:{
          'Content-Type':'application/json',
          Authorization: `Token ${token}`,
        },
        method:'POST'
      })
      const response=await resp.json()
      if(response.Error=='NA'){
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location='/login';
      }
    
    }
    catch(err){
      console.log("error is",err);
    }
  }

  return (
    <div>
      <Button onClick={()=>{window.location.href='/createBlog'}}>Create Post</Button>
      <Button onClick={()=>{logout()}}>Logout</Button>
   
        <Modal
          open={showLikesPopup}
          onClose={() => {
            setPostId('');
            setShowLikesPopup(false);
          }}
        >
          <div style={{ backgroundColor: '#f0f0f0', width: '60%', maxWidth: '600px', margin: 'auto', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <h2 id="modal-title" style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>Likes</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', borderRadius: '5px', backgroundColor: 'white', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)' }}>
              {likesData.map((o, index) => (
                <div key={index} style={{ color: '#333', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: '10px', width: '30px', height: '30px', backgroundColor: '#ddd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{o.userName.charAt(0)}</div>
                  <div>{o.userId && o.userId==localStorage.getItem("userId")?('You'):(
                    <div>{o.userName}</div>
                  )}
                  </div>
                  
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Button onClick={() => { addreaction(); }} style={{ backgroundColor: '#333', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Like</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button variant="contained" onClick={() => { setPostId(''); setShowLikesPopup(false); }} style={{ backgroundColor: '#aaa', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                Close Modal
              </Button>
            </div>
          </div>
        </Modal>



        <Modal
          open={showCommentsPopup}
          onClose={() => {
            setPostId('');
            setShowCommentsPopup(false);setNewComment('')
          }}
        >
          <div style={{ backgroundColor: '#f0f0f0', width: '60%', maxWidth: '600px', margin: 'auto', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <h2 id="modal-title" style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>Comments</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', borderRadius: '5px', backgroundColor: 'white', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)' }}>
              {commentsData.map((o) => (
                <div key={o._id} style={{ color: '#333', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: '10px', width: '30px', height: '30px', backgroundColor: '#ddd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {o.userName.charAt(0)}
                    </div>
                  <div>{o.userId && o.userId==localStorage.getItem("userId")?('You'):(
                    <div>{o.userId && o.userName}</div> 
                  )}
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div>{o.description}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Input type="text" value={newComment} onChange={(e)=>{setNewComment(e.target.value)}}/>

              <Button onClick={() => { addComments(); }} style={{ backgroundColor: '#333', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Comment</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button variant="contained" onClick={() => { setPostId(''); setShowCommentsPopup(false);setNewComment('') }} style={{ backgroundColor: '#aaa', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                Close Modal
              </Button>
            </div>
          </div>
        </Modal>


{
   data!=undefined &&  data && 
  data.map((o) => {
    return (

      <div key={o.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '25px', marginLeft:'20%',marginRight:'20%', borderRadius: '5px' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          {new Date(o.dateModified).toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})}
        </p>
        {o.id && o.userId && <div style={{ marginBottom: '5px' }}>
          {o.userId ==localStorage.getItem("userId")?('You'):(<div>{o.userName}</div>)}
          </div>
        }
        
        <p style={{ marginBottom: '10px' }}>{o.description}</p>
      
        <Button
          onClick={() => {
            setShowLikesPopup(true);
            setPostId(o.id);
          }}
          style={{ marginRight: '5px' }}
        >
          Like
        </Button>
        <Button
          onClick={() => {
            setShowCommentsPopup(true);
            setPostId(o.id);
          }}
        >
          Comment
        </Button>
      </div>
    );
  })
}
<Button onClick={()=>{setPage(prev=>prev+1)}}>Fetch More Records</Button>
      {
        Array.from(data).length==0 && <div>
          No Data Found!
        </div>
      }

<Snackbar
 sx={{ vertical: 'bottom',
 horizontal: 'left'}}
  open={isSnackbar}
  message={isSnackbarMsg}
/>
     

    </div>
  )
}

export default Landing

