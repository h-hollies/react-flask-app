import unittest
from main import create_app
from exts import db
from config import TestConfig, BASE_DIR
import os


class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'test.db')
        self.app.config['SQLALCHEMY_ECHO'] = False
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

        with self.app.app_context():            
            db.create_all()

#---------------------------------------------------------------------------------------------------------------
    
    def test_hello_world(self):
        hello_response = self.client.get('/recipe/hello')
        
        json = hello_response.json
        
        self.assertEqual(json, {"message": "Hello, world!"})

#----------------------------------------------------------------------------------------------------------------
    
    def test_signup(self):
        signup_response = self.client.post('/auth/signup',
            json = {"username": "testuser",
                    "email": "testuser@test.com",
                    "password": "password"}
        )
        
        status_code = signup_response.status_code
        
        self.assertEqual(status_code, 201)
        
    
    def test_login(self):
        signup_response = self.client.post('/auth/signup',
            json = {"username": "testuser",
                    "email": "testuser@test.com",
                    "password": "password"}
        )
        
        login_response = self.client.post('/auth/login',
            json = {"username": "testuser",
                    "password": "password"})
        
        status_code = login_response.status_code
        
        # json = login_response.json
        # print(json)
        
        self.assertEqual(status_code, 200)

#--------------------------------------------------------------------------------------------------------------------
        
    def test_get_all_recipes(self):
        """"TEST GETTING ALL RECIPES"""
        response = self.client.get("/recipe/recipes")
        
        #print(response.json)
        
        status_code = response.status_code
        
        self.assertEqual(status_code, 200)
    
    
    def test_get_one_recipe(self):
        """TEST GETTING ONE RECIPE"""
        id = 1
        response = self.client.get(f"/recipe/recipe/{id}")
        status_code = response.status_code
        
        
        self.assertEqual(status_code, 404)
    
    
    def test_create_recipe(self):
        """TEST CREATING A RECIPE"""
        # SETUP USER AND GENREATE A RECIPE TO TEST CREATE FUNCTION (NEEDS ACCESS TOKEN TO CREATE RECIPE)
        
        signup_response = self.client.post('/auth/signup',
            json = {"username": "testuser",
                    "email": "testuser@test.com",
                    "password": "password"}
        )
        
        login_response = self.client.post('/auth/login',
            json = {"username": "testuser",
                    "password": "password"}
        )
        
        access_token = login_response.json["access_token"]
        
        # print(f"Access_Token = ***{access_token}***")
        
        create_recipe_response = self.client.post('/recipe/recipes',
            headers={
                "Authorization": f'Bearer {access_token}'
                },
            json={
                "title" :"Test cookie",
                "description": "Test Description"
                }
            )
        
        status_code = create_recipe_response.status_code
        
        #print(create_recipe_response.json)
        
        self.assertEqual(status_code, 201)

    
    def test_update_recipe(self):
        """TEST UPDATING A RECIPE"""
        # SETUP USER AND GENREATE A RECIPE TO TEST UPDATE FUNCTION
        
        signup_response = self.client.post('/auth/signup',
            json = {"username": "testuser",
                    "email": "testuser@test.com",
                    "password": "password"}
        )
        
        login_response = self.client.post('/auth/login',
            json = {"username": "testuser",
                    "password": "password"}
        )
        
        access_token = login_response.json["access_token"]
        
        # print(f"Access_Token = ***{access_token}***")
        
        create_recipe_response = self.client.post('/recipe/recipes',
            headers={
                "Authorization": f'Bearer {access_token}'
                },
            json={
                "title" :"Test cookie",
                "description": "Test Description"
                }
            )
        
        # UPDATE RECIPE
        id = 1
        
        update_response = self.client.put(f"/recipe/recipe/{id}",
            headers={
                "Authorization": f'Bearer {access_token}'
                },
            json={
                "title" :"Test cookie UPDATED",
                "description": "New updated description"
                }
            )
        
        #print(update_response.json)
        
        status_code = update_response.status_code
        self.assertEqual(status_code, 200)
        
        
    
    def test_delete_recipe(self):
        """TEST DELETING A RECIPE"""
        # SETUP USER AND GENREATE A RECIPE TO TEST DELETE FUNCTION (NEEDS ACCESS TOKEN)
        
        signup_response = self.client.post('/auth/signup',
            json = {"username": "testuser",
                    "email": "testuser@test.com",
                    "password": "password"}
        )
        
        login_response = self.client.post('/auth/login',
            json = {"username": "testuser",
                    "password": "password"}
        )
        
        access_token = login_response.json["access_token"]
        
        
        # CREATE A RECIPE TO DELETE
        create_recipe_response = self.client.post('/recipe/recipes',
            headers={
                "Authorization": f'Bearer {access_token}'
                },
            json={
                "title" :"Test cookie",
                "description": "Test Description"
                }
            )
        
        # DELETE RECIPE
        
        id = 1
        delete_response = self.client.delete(f"/recipe/recipe/{id}",
            headers = {
                'Authorization': f'Bearer {access_token}'
            }
        )
        
        status_code = delete_response.status_code
        self.assertEqual(status_code, 200)

#-------------------------------------------------------------------------------------------------

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
            

if __name__ == '__main__':
    unittest.main()