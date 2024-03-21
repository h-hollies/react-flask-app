# Reactjs with Flask
## Setup
- Setup  a virtual environment using 'python3 -m venv .venv' command.
- Activate the created virtual environment by running 'source venv/bin/activate'.
- Install all required packages for react and flask (libraries.txt)
- setup config:
    - create a new file named config.py
    - create file called .env
    - all sensitive data should be stored in the .env file
    - inside config.py 'from decouple import config' to access all variables from .env file
    - generate secret key in the terminal:
        - run python3
        - '>>> import secrets'
        - '>>> secrets.token_hex(12)'
- Once database models are setup, from terminal you need to initialize the database:
    - run commands:
        - export FLASK_APP=main.py
        - flask shell
        - db (This gets you into the database)
        - From here you can check your models by typing in the classes set up in the models
        - Run command db.create_all()
- update an existing database use flask_migrate
    - in command line run flask db init (this creates a migrations folder to track changes)
    - once you have configured your database model run command "flask db migrate -m 'add user table'"
    - then run 'flask db upgrade'

- Seperate each type of route ie/ signup, login, or recipes into their own namespace in a seperate .py file, be sure to include your database models in these files! Now when you access the localhost:5000/docs you will have your routes organized into their own namespaces.

- You can manually test the API through [Insomnia](https://snapcraft.io/install/insomnia/ubuntu) or via 'localhost:5000/docs', you can send POST PUT GET DELETE requests and see the response

- To test your api automatically you can create a test_api.py file that has a test.db assigned separate from the production database. Import unittest and create an APITestCase class with all of the post, put and get requests that your api handles. Remember that some requests may require a user to be logged in and an autentication key to be provided, insure you have a user account created and logged in for each testcase!

## Once Backend has been tested its time to create the frontend

- Navigate to client directory
- In terminal type command, 'npx create-react-app client'
- 'cd' into client and run 'npm start' to start application (this runs on localhost:3000)
- configure backend (running on localhost:5000) to communicate with  the front end (localhost:3000) using cors 'cross origin request sharing':
    - pipenv install flask-cors
    - In main.py
        - import CORS and add CORS(app) to configuration
    - In client/package.json
        - Add "proxy": "http://localhost:5000",
- Remove all files in the client/src directory and create index.js file
    - From here you can send data to the index.html page inside /client/public folder

- Install:
    - npm install react-router-dom
    - npm install react-bootstrap bootstrap import bootstrap css into index.js file This can be found on the [bootstrap website](https://react-bootstrap.github.io/docs/)

- Create folder in SRC directory named components to store all of our React Components ie/ NavBar.js (Must be CamelCase)

- Validate user input from creating an account using [react-hook-form](https://www.react-hook-form.com)
    - Install with 'pip install react-hook-form'

- For help with token authorization handling install [react-token-auth](https://github.com/obabichev/react-token-auth)
    - npm install react-token-auth

## Deploy application on [heroku](https://dashboard.heroku.com/apps)
    - First generate a new application
    - 'mv * ..' all files in the backend folder to the root directory
    - .env wont be moved, this can be now set in heroku
    - open settings/ show config vars and set environment variables in here
    - pip install gunicorn to deploy app
    - in vscode create requirements.txt with 'pip freeze >> requirements.txt'
    - Alter run.py file to use production varibales and remove app.run() command so flask nolonger deploys app
    - in root directory create Procfile and input gunicorn commands:
        - web gunicorn run:app
    - delete node_modules folder and package-lock-json
    - inside client directory run:
        - 'npm i react-scripts' command
        - 'npm run build' command
    
    - In main.py:
        - Set the root directory for the application:
            app=Flask(__name__, static_url_path='/', static_folder='./client/build')
        - Add route to index and error handling:
                @app.route('/')
                def index():
                    return app.send_static_file('index.html')
    
                @app.errorhandler(404)
                def not_found(err):
                    return app.send_static_file('index.html')

## Send App to Github
    - create repository
    - git init
    - remove the build folder from .gitignore
    - git add --all
    - git commit -m "heroku-commit"
    - git push --set-upstream https://github.com/h-hollies/<repository-name> main
