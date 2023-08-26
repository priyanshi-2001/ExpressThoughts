import React from 'react'
import { useState,useEffect } from 'react';
import {Input,Button,TextField} from '@mui/material'
// const url="http://localhost:8000/";
const url='https://djnago-myblogs-site.onrender.com/';
const CreateBlog = () => {
  const [details,setDetails]=useState({
    body:''    
})

const token=localStorage.getItem("token");


const createPost=async()=>{
    try{
        
        const res=await fetch(url+"createBlog/",{
        headers:{
            'Content-Type':'application/json',
            Authorization: `Token ${token}`,
        },
        method:'POST',
        body:JSON.stringify({
            description:details.body
        })
    })
    const resp=await res.json();
    if(resp.Error=='NA'){
        window.location.href="/landing";       
    }


    }
    catch(err){
        console.log("err",err);
    }
}

const handleChange=(e)=>{

    setDetails((prev)=>({...prev,[e.target.name]:e.target.value}));
    console.log("details",details);
}


  return (
     
<div style={{
     backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
 
    <div>
      <TextField
        placeholder='Please enter Body of Blog'
        name='body'
        value={details.body}
        rows={20}
        multiline
        sx={{width:'600px'}}
        onChange={(e) => {handleChange(e)}}
        style={{width: '600px'}}
      />
    </div>
   
    <div>
      <Button onClick={() => {createPost()}} style={{marginTop: '10px'}}>Add</Button>
    </div>

 
</div>

  )
}

export default CreateBlog