import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import './css/Styles.css';


const CreateRecipePage=()=>{

    const {register, handleSubmit, reset, formState:{errors}} = useForm()
    const navigate = useNavigate();

    const createRecipe=(data)=>{
        console.log(data)
        
        // Get token key from local storage in users browser (inside Console/local storage)
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
        console.log(token)

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${JSON.parse(token)}`  //the token is stored in the local storage of the user's browser!
            },
            body: JSON.stringify(data)
        }

        fetch('/recipe/recipes', requestOptions)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))

        reset()  // Reset the form after submission

        navigate('/')
    }

    return(
        <div className="main-container">
            <h1>Create A Recipe</h1>
            <form>

                <Form.Group className='recipe-form'>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text"
                        placeholder='Enter title'
                        {...register('title', {required: true, maxLength: 25})}
                    />
                </Form.Group>
                {errors.title && <p className="signup-errors"><small>Title is required</small></p>}
                {errors.title?.type==="maxLength" && <p className="signup-errors"><small>Max length 25 characters</small></p>}

                <Form.Group className='recipe-form'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={5}
                        placeholder='Enter description'
                        {...register('description', {required: true, maxLength: 255})}
                    />
                </Form.Group>
                {errors.description && <p className="signup-errors"><small>Description is required</small></p>}
                {errors.description?.type==="maxLength" && <p className="signup-errors"><small>Max length 255 characters</small></p>}
                <br></br>

                <Form.Group>
                    <Button variant="primary" onClick={handleSubmit(createRecipe)}>Save</Button>
                </Form.Group>

            </form>
        </div>
    )
}

export default CreateRecipePage;