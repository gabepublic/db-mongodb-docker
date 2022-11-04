# db-mongodb-docker

[MongoDB](https://www.mongodb.com/) is a document-oriented NoSQL database 
with good support within the Node.js ecosystem.

[Mongoose](https://mongoosejs.com/) is mongodb object modeling for `nodejs`.
It provides a straight-forward, schema-based solution to model 
the domain model. It includes built-in type casting, validation, 
query building, business logic hooks and more, out of the box.

For cloud service option, go to https://www.mongodb.com/atlas/database


## Topics covered:

- Using prebuilt `mongodb` container
- Demo using `mongoose` javascript library
- Demo using python flask 

## Prerequisite

- Docker

## SETUP mongodb container

- Start the container
```
$ docker run --name localdb \
             -d \
			 -p 27017:27017 \
			 mongo:latest
```

- Enter the container
```
$ docker exec -it localdb bash
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
> help

```

- Log
```
$ docker logs localdb
```

- [CONFIGURE] Persisting Data With Volumes
  MongoDB image stores its data in the container `/data/db` directory.
  Mount a volume, `data`, to container directory, to persist the data 
  on the local storage
```
# stop docker
$ docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
[...]
$ docker stop <container-id>

$ cd <project-folder>
$ mkdir data-mongodb
$ docker run --name localdb \
             -d \
			 -p 27017:27017 \
             -v $(pwd)/data-mongodb:/data/db \
			 mongo:latest
```

  - Open another terminal, check the existing volumes
```
$ docker volume ls
DRIVER    VOLUME NAME
[...]
local data-mongodb 
```

- [CONFIGURE] Mount custom config from a volume. NOTE: 
  - the default config directory (in container) `/etc/mongod.conf`.
  - `--config` specifies the target location of the config file
```
$ docker run --name localdb \
             -d \
			 -p 27017:27017 \
             -v $(pwd)/data-mongodb:/data/db \
             -v ./mongo.conf:/etc/mongo/mongo.conf \
             --config /etc/mongo/mongo.conf	\ 
			 mongo:latest
```

- [CONFIGURE] Add security by setting the username and password using
  the environment variables, MONGODB_INITDB_ROOT_USERNAME and 
  MONGODB_INITDB_ROOT_PASSWORD:
```
$ docker run --name localdb \
             -d \
			 -p 27017:27017 \
             -v $(pwd)/data-mongodb:/data/db \
             -v ./mongo.conf:/etc/mongo/mongo.conf \
             --config /etc/mongo/mongo.conf	\
             -e MONGODB_INITDB_ROOT_USERNAME=example-user \
             -e MONGODB_INITDB_ROOT_PASSWORD=example-user-password \			 
			 mongo:latest
```
  - A more secured method - since the new user will be granted root 
    privileges, and will have access control to everything, it is 
	important to protect the password. Use the secrets file as input 
	to the environment variable MONGODB_INITDB_ROOT_PASSWORD_FILE. 
	The password will not be visible on using `docker inspect` to view 
	the container environment variables.
```
$ docker run --name localdb \
             -d \
			 -p 27017:27017 \
             -v $(pwd)/data-mongodb:/data/db \
             -v ./mongo.conf:/etc/mongo/mongo.conf \
             --config /etc/mongo/mongo.conf	\
             -e MONGODB_INITDB_ROOT_USERNAME=example-user \
             -e MONGODB_INITDB_ROOT_PASSWORD_FILE=$(pwd)/secrets/pwd \			 
			 mongo:latest
```

- Inspect the environment variables
```
$ docker inspect localdb
[
    {
        "Id": "6b33c6b38c4386ae9e89d4cd5be78decfce8d466fde434cc4be320ccf7b4842c",
        "Created": "2022-11-03T23:52:42.7378438Z",
        "Path": "docker-entrypoint.sh",
        "Args": [
            "mongod"
        ],

[...]
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "NetworkID": "512e1aae191b28a761ed19b041c5179f4f5f1778512dd13b07ae7df1d18ded89",
                    "EndpointID": "bb556e700e01ea9eca6702c41129eefcedac7fb523c8e7307056181c9b5e65cd",
                    "Gateway": "172.17.0.1",
                    "IPAddress": "172.17.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:11:00:02",
                    "DriverOpts": null
                }
            }
        }
    }
]
```

- Connect from another container
  Note: by default, containers run on their own network; therefore,
  a shared network needs to be created before running the containers;
  otherwise, they can't connect to each other. 
```
$ docker network create sm-network
$ docker run --name localdb -d -p 27017:27017 --network sm-network mongo:latest
# run other containers...
```
  - Also see "Demo Python flask" below


## Demo Javascript Mongoose

Source: [Mongoose - Getting started](https://mongoosejs.com/docs/)

- The `src-js` folder contains the nodejs application

- Prerequisites:
  - Nodejs

- Run docker in the default setting
```
$ docker run --name localdb \
             -d \
			 -p 27017:27017 \
			 mongo:latest
```

- Install mongoose
```
$ node --version
v18.12.0
$ npm --version
8.19.2
$ npm install mongoose --save
```

- Run the app to save Document into mongodb
```
$ cd src-js
$ node 01-getting-started.js
Silence
Meow name is fluffy
{
  name: 'fluffy',
  _id: new ObjectId("63647221b1140c1f439ec1c0"),
  __v: 0
}
Meow name is fluffy
CTRL-C
```

- Run the app to retrieve Document from mongodb
```
$ cd src-js
$ node 02-retrieve.js
[
  {
    _id: new ObjectId("636471241af1aed97ddf3ef8"),
    name: 'fluffy',
    __v: 0
  },
]
{
  _id: new ObjectId("636471241af1aed97ddf3ef8"),
  name: 'fluffy',
  __v: 0
}
Meow name is fluffy
CTRL-C
```


## Demo Python flask

Source: [Using MongoDB with Docker](https://earthly.dev/blog/mongodb-docker/)
Github: https://github.com/Soumi7/Mongo-Docker

- The `src-python` folder contains the flask application that has been
  cloned & selected from the github

- Prerequisites:
  - Python & python virtual environment

- Run docker in the default setting
```
$ docker run --name localdb \
             -d \
			 -p 27017:27017 \
			 mongo:latest

$ docker ps
```

- Setup python virtual environment
```
$ cd src-python
$ virtualenv ./.venv
$ source .venv/bin/activate
(.venv) $
```

- Install the python dependencies for the application
```
(.venv)$ cd src-python
(.venv)$ python --version
Python 3.8.2
(.venv)$ pip install -r requirements.txt
[...]
(.venv)$
```

- Run the flask web application
```
(.venv)$ cd src-python
(.venv)$ python app.py
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 129-202-506
 [...]
```

- [Alternative] Running the flask web application using the mongodb
  connection string from the OS environment variable
```
(.venv)$ cd src-python
(.venv)$ export MONGODB_CONNSTRING="localhost:27017"
(.venv)$ echo $MONGODB_CONNSTRING
localhost:27017
(.venv)$ 
(.venv)$ python app_atlas.py
 * Serving Flask app 'app_atlas'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

- CLEANUP
```
(.venv)$ deactivate
$
```

### Flask web application container

Another setup is to have the flask web application runs in the docker
container.

- Build the docker image
```
$ cd src-python
$ docker build -t studentapp:0.1.0 .
$ docker images
```

- Before running the container, create a shared network
```
$ docker network create sm-network
$ docker run --name localdb -d -p 27017:27017 --network sm-network mongo:latest
```

- Restart mongodb
```
$ docker stop localdb
$ docker rm localdb
$ docker run --name localdb -d -p 27017:27017 --network sm-network mongo:latest
```
 
- Start the flask web app container
```
$ docker run --name studentapp -d -p 5000:5000 --network sm-network studentapp:0.1.0
```