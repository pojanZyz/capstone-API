# User API Spec

## Register User API

Endpoint: POST /api/users

Request Body :
````json
{
    "username" : "admin",
    "password" : "Admin123#",
    "name" : "Administrator"
}
````
Response Body Success :
````json
{
    "data" : {
        "username" : "admin",
        "name" : "Administrator"
    },
}
````
Response Body Error :
````json
{
    "errors" : "Username already registered"
}
````
## Login User API

Endpoint : POST /api/users/login

Request Body :
````json
{
    "username" : "Admin",
    "password" : "rahasia"
}
````

Response Body Success :
````json
{
    "data" : {
        "token" : "unique token"
    }
}
````

Response Body Failed :
````json
{
    "errors" : "Username or password wrong"
}
````
## Update User API

Endpoint : PATCH /api/users/current

Headers :
- Authorization : token

Request Body :
````json
{
    "name" : "Admin", //optional
    "password" : "new password" //optional
}
````

Response Body Success :
````json
{
    "data" : {
        "username" : "Admin",
        "name" : "Administrator"
    }
}
````

Response Body Errors : 
````json
{
    "errors" : "Name length max 60"
}
````
## Get User API

Endpoint : GET /api/users/current

Headers :
- Authorization : token

Response Body Success :
````json
{
    "data" : {
        "username" : "Admin",
        "name" : "Administrator"
    }
}
````

Response Body Errors : 
````json
{
    "errors" : "Unauthorized"
}
````
## Logout User API

Endpoint : DELETE /api/users/logout

Response Body Success :
````json
{
    "data" : "OK"
}
````
Response Body Errors : 
````json
{
    "errors" : "Unauthorized"
}
````