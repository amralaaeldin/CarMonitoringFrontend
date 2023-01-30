import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import  { Redirect } from 'react-router-dom' 

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

  },
  avatar: {
     margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    marginTop:"10%"

  },
  form: {
    width: '100%', // Fix IE 11 issue.
    // marginTop: theme.spacing(1),

  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const classes = useStyles();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const usernamehandleChange = event => {

    console.log (event.target.value)

    setusername(event.target.value)

  }

  const passwordhandleChange = event => {

    console.log (event.target.value)

    setpassword(event.target.value)

  }



  function login(){

    if (username == "") {
      alert("Please enter Username ")
    }
    else if (password == "") {
      alert("Please enter Password ")
    }

    else if (username == "test" && password == "test") {
      

   
      props.history.push('./AddRallyDetails');
      localStorage.setItem("phonenumber", username);
      localStorage.setItem("waypoints",[])
      localStorage.setItem("orginValue","initial")
      localStorage.setItem("destinationValue","initial")
      localStorage.setItem("orginCenter",{})
      localStorage.setItem("destinationCenter",{})
      localStorage.setItem("Python",0)


    }

    else {

      alert("Entered Username and Password is incorrect")
    }


  }


  var bg=require('./login.jpg')


  return (

    // <div className='background-image' style ={ {  backgroundImage: `url(${bg})`,
    <div className='background-image' 
    style ={ { 
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh' ,
    backgroundColor:'#3fc484',
    bottom:20  } }>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper} >

      <h1 style={{textAlign:'center' ,fontSize:30,fontWeight:'bold',color:'white',marginTop:"50%"}}>CAR MONITORING
</h1>        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
   

        <h1 style={{textAlign:'center' ,fontSize:30,fontWeight:'bold',color:'white',marginTop:"5%"}}>        LOGIN
</h1>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Username"
            label="User Name"
            name="Username"
            autoFocus
            value={username}
            // type="number"
            onChange={usernamehandleChange}
            // onInput={(e) => {
            //   e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
            // }}

          />

         
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={passwordhandleChange}


          />

          <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => { login() }}
          >
            LOGIN
          </Button>

        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
    </div>
  );
}
