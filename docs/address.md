# Address API Spec

## Create Address API

Endpoint : POST /api/contact/:contactId/address

Headers :
- Authorization : token

Request Body :
````json
{
    "street" : "jalan apa",
    "city" : "kota apa",
    "provinsi" : "prov apa",
    "country" : "negara apa",
    "postalKode" : "Kode pos"
}
````

Response Body Success : 
````json
{
    "data" : {
        "id" : 1,
        "street" : "jalan apa",
        "city" : "kota apa",
        "provinsi" : "prov apa",
        "country" : "negara apa",
        "postalKode" : "Kode pos"
    }
}
````

Response Body Error : 
````json
{
    "errors" : "country is required"
}
````
## Update Address API

Endpoint : PUT /api/contact/:contactId/address/:addressId

Headers :
- Authorization : token

Request Body :
````json
{
    "street" : "jalan apa",
    "city" : "kota apa",
    "provinsi" : "prov apa",
    "country" : "negara apa",
    "postalKode" : "Kode pos"
}
````

Response Body Success : 
````json
{
    "data" : {
        "id" : 1,
        "street" : "jalan apa",
        "city" : "kota apa",
        "provinsi" : "prov apa",
        "country" : "negara apa",
        "postalKode" : "Kode pos"
    }
}
````

Response Body Error : 
````json
{
    "errors" : "country is required"
}
````
## Get Address API

Endpoint : GET /api/contact/:contactId/address/:addressId

Headers :
- Authorization : token

Response Body Success : 
````json
{
    "data" : {
        "id" : 1,
        "street" : "jalan apa",
        "city" : "kota apa",
        "provinsi" : "prov apa",
        "country" : "negara apa",
        "postalKode" : "Kode pos"
    }
}   
````

Response Body Error : 
````json
{
    "errors" : "contact is not found"
}
````
## List Address API

Endpoint : POST /api/contact/:contactId/address

Headers :
- Authorization : token

Response Body Success : 
````json
{
    "data" : {
        "id" : 1,
        "street" : "jalan apa",
        "city" : "kota apa",
        "provinsi" : "prov apa",
        "country" : "negara apa",
        "postalKode" : "Kode pos"
    },
    {
        "id" : 2,
        "street" : "jalan apa",
        "city" : "kota apa",
        "provinsi" : "prov apa",
        "country" : "negara apa",
        "postalKode" : "Kode pos"
    }
}
````

Response Body Error : 
````json
{
    "errors" : "contact is not found"
}
````
## Remove Address API

Endpoint : DELETE /api/contact/:contactId/address/:addressId

Headers :
- Authorization : token

Response Body Success : 
````json
{
    "data" : "ok"
}
````

Response Body Error : 
````json
{
    "errors" : "address is not found"
}
````