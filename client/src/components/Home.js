import React, { useEffect, useState } from 'react';
import { Link } from'react-router-dom';
import { Modal, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { useAuth } from '../auth';
import './css/Styles.css';
import Recipe from './Recipe';

const LoggedInHome=()=>{
    const [recipes, setRecipes] = useState([]);
    const [show, setShow] = useState(false);
    const {register, handleSubmit, setValue, formState:{errors}} = useForm();
    const [recipeId, setRecipeId] = useState(0);
    let token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

    // Modal windows (from react-bootstrap) to update recipes
    const closeModal=()=>{
        setShow(false)
    }

    const showModal=(id)=>{
        setShow(true)
        setRecipeId(id)
    };

    // Once modal setShow find corrosponding recipe and update fields
    React.useEffect(() => {
        if (show && recipeId) {
            const recipe = recipes.find((recipe) => recipe.id === recipeId);
            if (recipe) {
                setValue("title", recipe.title);
                setValue("description", recipe.description);
            }
        }
    }, [show, recipeId, recipes, setValue]);

    useEffect(
        () => {
            fetch('/recipe/recipes')
            .then(res => res.json())
            .then(data => {
                setRecipes(data)
            })
            .catch(err => console.log(err))
        },[]
    );

    // This function will 'refresh' the page when it has been altered
    const GetAllRecipes=()=>{
        fetch('/recipe/recipes')
        .then(res => res.json())
        .then(data => {
            setRecipes(data)
        })
        .catch(err => console.log(err))
    }


    const updateRecipe=(data)=>{
        console.log(data)
        console.log(recipeId)

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`  //the token is stored in the local storage of the user's browser!
            },
            body: JSON.stringify(data)
        }

        fetch(`/recipe/recipe/${recipeId}`, requestOptions) // Insure that the correct `` is used when using a javascript variable not ''
        .then(res => res.json())
        .then(data => {
            console.log(data)
            GetAllRecipes()
            setShow(false)
        })
        .catch(err => console.log(err))
    }

    const deleteRecipe=(id)=>{

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`  //the token is stored in the local storage of the user's browser!
            },
        }

        fetch(`/recipe/recipe/${id}`, requestOptions) // Insure that the correct `` is used when using a javascript variable not ''
        .then(res => res.json())
        .then(data => {
            console.log(data)
            GetAllRecipes()
        })
        .catch(err => console.log(err))
    }

    return(
        <div className="home main-container"> 
            {/* Modal for updating recipe*/}
            <Modal
                show={show}
                size="lg"
                onHide={closeModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Update Recipe
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

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
                        <Button variant="primary" onClick={handleSubmit(updateRecipe)}>Update</Button>
                    </Form.Group>

                    </form>

                </Modal.Body>

            </Modal>

            <h1>List of recipes</h1>
            {
                /*index is the id value stored in the database*/
                recipes.map(
                    (recipe, index)=>(
                        <Recipe
                        key={index}
                        title = {recipe.title}
                        description = {recipe.description}
                        onClick = {()=>showModal(recipe.id)}
                        onDelete = {()=>deleteRecipe(recipe.id)}
                        />
                ))
            }
        </div>
    )
}

const LoggedOutHome=()=>{
    return(
        <div className="home main-container">
            <h1 className="heading">Welcome to the Recipes homepage!</h1>
            <Link className="btn btn-primary btn-lg" to='/signup'>Get Started</Link>
        </div>
    )
}


const HomePage=()=>{

    const [logged] = useAuth();

    return(
        <>
            {logged?<LoggedInHome/>:<LoggedOutHome/>}
        </>
    )
}

export default HomePage;