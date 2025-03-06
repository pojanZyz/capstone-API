# Contact API Spec

## Create Contact API

Endpoint : POST /api/contact

Headers :
- Authorization : token

Request Body :
````json
{
    "firstName" : "Ahmad",
    "lastName" : " Faozan",
    "email" : "akunword0@gmail.com",
    "phone" : "083847778511"
}
````
Response Body Success :
````json
{
    "data" : {
        "id" : 1,
        "firstName" : "Ahmad",
        "lastName" : "Faozan",
        "email" : "akunword0@gmail.com",
        "phone" : "083847778511"
    }
}
````
Response Body Errors :
````json
{
    "errors" : "number phone already used by others contact"
}
````
## Update Contact API

Endpoint : PUT /api/contact

Headers :
- Authorization : token

Request Body :
````json
{
    "firstName" : "Ahmad",
    "lastName" : " Faozan",
    "email" : "akunword0@gmail.com",
    "phone" : "083847778511"
}
````

Response Body Success :
````json
{
    "data" : {
        "id" : 1,
        "firstName" : "Ahmad",
        "lastName" : "Faozan",
        "email" : "akunword0@gmail.com",
        "phone" : "083847778511"
    }
}
````

Response Body Errors :
````json
{
    "errors" : "email is not valid format"
}
````
## Get Contact API

Endpoint : GET /api/contact/:id

Headers :
- Authorization : token

Response Body Success :
````json
{
    "data" : {
        "id" : 1,
        "firstName" : "Ahmad",
        "lastName" : "Faozan",
        "email" : "akunword0@gmail.com",
        "phone" : "083847778511"
    }
}
````
Response Body Errors :
````json
{
    "errors" : "contact is not found"
}
````
## Search Contact API

Endpoint : POST /api/contact/

Headers :
- Authorization : token

Query params : 
- name : Search by firstName or lastName, using like, optional
- email : Search by email using like, optional
- phone : Search by phone using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :
````json
{
    "data" : [{
        "id" : 1,
        "firstName" : "Ahmad",
        "lastName" : "Faozan",
        "email" : "akunword0@gmail.com",
        "phone" : "083847778511"
    },
    {
        "id" : 2,
        "firstName" : "Ahmad",
        "lastName" : "Faozan",
        "email" : "akunword0@gmail.com",
        "phone" : "083847778511"
    }],
    "paging" : {
        "page" : 1,
        "totalPage" : 3,
        "totalItem" : 30
    }
}
````
## Remove Contact API

Endpoint : DELETE /api/contact/:id

Headers :
- Authorization : token

Response Body Success :
````json
{
    "data" : "ok"
}
````
Response Body Errors :
````json
{
    "errors" : "contact is not found"
}
```` 