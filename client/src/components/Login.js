import { Form, Button } from'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { login } from '../auth';

import './css/Styles.css';


const LoginPage=()=>{

    const { register, handleSubmit, reset, formState:{errors} } = useForm();

    const navigate = useNavigate();

    // Function to Submit the Form
    const loginUser = (data)=>{
        console.log(data)

        const body = {
            username: data.username,
            password: data.password
        }

        // Options to send data to backend
        const requestOptions = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    
        // Send Request to backend and log any errors
        fetch('/auth/login', requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data.access_token)
            login(data.access_token);

            navigate('/')
        })
        .catch((e) => alert("Invalid Username or Password", e));

        reset()
    }

    return(
        <div className="main-container">
            <div className="form">
                <h2>Login Page</h2>
                <form>

                    {/*"""Users Username"""*/}
                    <Form.Group className="signup-form">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"
                            placeholder="Enter Username"
                            {...register('username', {required: true, maxLength:25})}
                        />
                    </Form.Group>
                    {errors.username && <p className="signup-errors">
                        <small>Username is required</small></p>}
                    {errors.username?.type === "maxLength" && <p className="signup-errors">
                        <small>Max length 25 characters</small></p>}

                    {/*"""Users Password"""*/}
                    <Form.Group className="signup-form">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"
                            placeholder="Enter Password"
                            {...register('password', {required: true, minLength:8})}
                        />
                    </Form.Group>
                    {errors.password && <p className="signup-errors">
                        <small>Password is required</small></p>}
                    {errors.password?.type ==="minLength" && <p className="signup-errors">
                        <small>Min length 8 characters</small></p>}

                    {/*"""Submit Button"""*/}
                    <Form.Group>
                        <Button as="sub" variant="primary" onClick={handleSubmit(loginUser)}>LogIn</Button>
                    </Form.Group>

                    {/*"""Already have an account?"""*/}
                    <Form.Group className="signup-form-link">
                        <small>Do not have an account? <Link className="link-2" to="/signup">Create Account</Link></small>
                    </Form.Group>
                    
                </form>
            </div>
        </div>
    )
}

export default LoginPage;