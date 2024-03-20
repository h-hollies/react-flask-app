import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import './css/Styles.css';


const SignUpPage=()=>{

    const {register, watch, handleSubmit, reset, formState:{errors}} = useForm();
    const [show, setShow] = useState(false);

    // Function to Submit the Form
    const submitForm=(data)=>{

        // Check passwords match
        if (data.password === data.confirmPassword) {

            // User input
            const body = {
                username: data.username,  
                password: data.password,  
                email: data.email
            }; 

            // Options to send data to backend
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            };
        
            // Send Request to backend and log any errors
            fetch('/auth/signup', requestOptions)
            .then(res => {
                console.log("Response: ", res.status);

                // If response 201, show success message
                if (res.status === 201 || res.status === 200) {
                    setShow(true);
                }
            })
            .catch((err) => console.log("Error:", err))

            reset()
        }

        // If passwords do not match
        else {
            alert("Passwords do not match")
        }
    }

    console.log(watch("username"));
    console.log(watch("email"));
    console.log(watch("password"));
    console.log(watch("confirmPassword"));

    return(
        <div className="main-container">
            <div className="form">

                {/*Success Message*/}
                {/*If show is true*/}
                {show?
                <>
                    <Alert variant='success' onClose = {() => setShow(false)} dismissible> {/*dismissible allows user to close*/}
                        <Alert.Heading>Account Created</Alert.Heading>
                        <p>
                            Your account has been successfully created. Please continue to 
                            <Link to="/login"> Login</Link>
                        </p>
                    </Alert>
                    <h2>Sign Up Page</h2>
                </>

                // else
                :
                    <h2>Sign Up Page</h2>
                }

                <form>

                    {/*"""Create Username"""*/}
                    <Form.Group className="signup-form">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"
                            placeholder="Enter Username"
                            {...register('username', {required: true, maxLength:25})}  /*Validates that a username is entered correctly*/ 
                            />
                    </Form.Group>
                    {/*"""Error handling"""*/}
                    {errors.username && <p className="signup-errors"><small>Username is required</small></p>}
                    {errors.username?.type==="maxLength" && <p className="signup-errors"><small>Max length 25 characters</small></p>}


                    {/*"""Create E-mail"""*/}
                    <Form.Group className="signup-form">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control type="email"
                            placeholder="Enter E-mail"
                            {...register('email', {required: true, maxLength:80})}
                            />
                    </Form.Group>
                    {errors.email && <p className="signup-errors"><small>Email is required</small></p>}
                    {errors.email?.type==="maxLength" && <p className="signup-errors"><small>Max length 80 characters</small></p>}


                    {/*"""Create Password"""*/}
                    <Form.Group className="signup-form">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"
                        placeholder="Enter Password"
                        {...register('password', {required: true, minLength:8})}
                        />
                    </Form.Group>
                    {errors.password && <p className="signup-errors"><small>Password is required</small></p>}
                    {errors.password?.type==="minLength" && <p className="signup-errors"><small>Min length 8 characters</small></p>}

                    
                    {/*"""Confirm Password"""*/}
                    <Form.Group className="signup-form">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password"
                        placeholder="Confirm Password"
                        {...register('confirmPassword', {required: true, minLength:8})}
                        />
                    </Form.Group>
                    {errors.confirmPassword && <p className="signup-errors"><small>Confirmation is required</small></p>}
                    {errors.confirmPassword?.type==="minLength" && <p className="signup-errors"><small>Min length 8 characters</small></p>}


                    {/*"""Submit Button"""*/}
                    <Form.Group>
                        <Button as="sub" variant="primary" onClick={handleSubmit(submitForm)}>SignUp</Button>
                    </Form.Group>

                    {/*"""Already have an account?"""*/}
                    <Form.Group className="signup-form-link">
                        <small>Already have an account? <Link className="link-2" to="/login">Login</Link></small>
                    </Form.Group>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage;