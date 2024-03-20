from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import JWTManager, create_refresh_token, create_access_token, jwt_required

from models import Recipe

recipe_ns = Namespace('recipe', description='A namespace for recipes')


# Model (serializer)
recipe_model  = recipe_ns.model('Recipe', {
    'id' : fields.Integer(),
    'title' : fields.String(required=True),
    'description' : fields.String(required=True)
})




@recipe_ns.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {"message": "Hello, world!"}
    
#--------------------------------------------------------------------------------------------------------------

@recipe_ns.route("/recipes")
class RecipesResource(Resource):
    
    @recipe_ns.marshal_list_with(recipe_model) # Decorator turns db query into json to display on screen 
    def get(self):
        """Get all recipes"""
        recipes = Recipe.query.all()
        
        return recipes


    @recipe_ns.marshal_with(recipe_model) # Decorator turns single object into JSON
    @recipe_ns.expect(recipe_model) # Expects data
    @jwt_required() # Protects route
    def post(self):
        """Create a new recipe"""
        data = request.get_json() # Gets data from the POST request

        new_recipe = Recipe(
            title=data.get('title'),
            description=data.get('description')
            )
        
        new_recipe.save()
        return new_recipe, 201
    
#------------------------------

@recipe_ns.route("/recipe/<int:id>")
class RecipeResource(Resource):
    
    @recipe_ns.marshal_with(recipe_model)
    def get(self,id):
        """Get a recipe by id"""
        recipe = Recipe.query.get_or_404(id)
        
        return recipe
    
    
    @recipe_ns.marshal_with(recipe_model)
    @jwt_required()
    def put(self,id):
        """Update recipe by id"""
        recipe_to_update = Recipe.query.get_or_404(id)
        
        data = request.get_json()
        recipe_to_update.update(
            data.get('title'),
            data.get('description')
        )
        
        return  recipe_to_update
    
    
    @recipe_ns.marshal_with(recipe_model)
    @jwt_required()
    def delete(self,id):
        """Delete recipe by id"""
        recipe_to_delete = Recipe.query.get_or_404(id)
        recipe_to_delete.delete()
        
        return recipe_to_delete