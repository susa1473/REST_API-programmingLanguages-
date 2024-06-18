const express = require('express');
const mysql = require('mysql2');
const Joi = require('joi');
const port =process.env.PORT || 3000;

// Create a connection to your MySQL database
var connection = mysql.createConnection({
    host: 'db4free.net', 
    user: 'vellinge',      
    password: '0LEQ&xk4&hVXyrQR',     
    database: 'leqxkhvxyrqr'   
  });
 
//Create a Express instance
const app = express();

//Config express
app.use(express.json())
app.use(
    express.urlencoded({
    extended: true,
  }),
);

app.listen(port, () => {
    console.log("Listening on port "+port);
});

//GET : Get objects
app.get('/', async function(req, res)
{   console.log("GET on Server side");
    res.send("Hello from server!");    
})

//GET : Get objects
app.get('/api/programming_languages', async function(req, res) {   
    try 
    {
        connection.connect(function(err) 
        {
            if (err) 
                throw err;            
            // Query the database
            connection.query("SELECT * FROM programming_languages", function (err, result) {
            if (err) 
                throw err;
          
              res.send(result);
            });
        });         
    } 
    catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }   
})

//GET : Get object
app.get('/api/programming_languages/:id', async function(req, res) {  
    try 
    {
        connection.connect(function(err) 
        {
            if (err) 
              throw err;           
          
            // Query the database
            connection.query("SELECT * FROM programming_languages where id="+parseInt(req.params.id), function (err, result) 
            {
                if (err) 
                    throw err;

                if(result.length === 0){
                    //404 Not found
                    return res.status(404).send("The programming language with the given ID was not found!");  
                }  
          
                res.send(result);
            });
         });
    } 
    catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }    
})

//User-defined function to validate the programming language
function validateProgrammingLanguage(programming_language){   
    const schema = Joi.object({
        name: Joi.string().min(1).max(255).required().messages({
            'string.base': `"Name" should be a type of 'text'`,
            'string.empty': `"Name" cannot be an empty field`,
            'string.min': `"Name" should have a minimum length of {#limit}`,
            'any.required': `"Name" is a required field`
        }),
        released_year: Joi.number().min(1970).max(2030).required().messages({            
            'string.empty': `"Release year" cannot be an empty field`,
            'string.min': `"Release year" should have a minimum length of {#limit}`,
            'any.required': `"Release year" is a required field`
        })              
    });
    return schema.validate({name: programming_language.name, released_year: programming_language.released_year}, { abortEarly: false });
}

//Create database string
function CreatePostSqlString(parameter){
    let sqlstring="INSERT IGNORE INTO programming_languages(name,info, released_year,githut_rank) VALUES (";
    sqlstring+='"'+parameter.name+'"'+","+'"';
    sqlstring+=parameter.info+'"';
    sqlstring+=","+parameter.released_year;
    sqlstring+=","+parameter.githut_rank+")";
    return sqlstring;
}

//PUT : Modify Object. Add a programming language after validating
app.post('/api/programming_languages', async function(req, res){     
    try 
    { 
        const {error} = validateProgrammingLanguage(req.body); 
        if(error){
            //400 Bad Request
            return res.status(400).send(error.details[0].message);
        }
        connection.connect(function(err) 
        {
            connection.query(CreatePostSqlString(req.body), function (err, result)       
            {
                if (err) 
                    throw err;            
          
                res.send(result);
            });
        });
    } 
    catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }    
});

//Create database string
function CreatePutSqlString(parameter){
    let sqlstring="UPDATE programming_languages set name=";
    sqlstring+='"'+parameter.name+'"'+ ",";
    sqlstring+='info="'+parameter.info+'"'+",";
    sqlstring+='released_year="'+parameter.released_year+'"'+",";    
    sqlstring+='githut_rank="'+parameter.githut_rank+'"'+" where id=";
    return sqlstring;
}

//PUT : Modify Object
app.put('/api/programming_languages/:id', async function(req, res){
    try 
    {
        const {error} = validateProgrammingLanguage(req.body); 
        if(error){
            //400 Bad Request
            return res.status(400).send(error.details[0].message);
        }
        connection.connect(function(err) 
        {
            if (err) 
              throw err;
          
            // Query the database
            connection.query(CreatePutSqlString(req.body)+parseInt(req.params.id), function (err, result) 
            {
                if (err) 
                    throw err;                
                res.send(result);
            });
         });
    } 
    catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }    
});

//DELETE: Delete Object
app.delete('/api/programming_languages/:id', async function(req, res){
    try 
    {
        connection.connect(function(err) 
        {
            if (err) 
              throw err;
            
            // Query the database
            connection.query("delete from programming_languages where id="+parseInt(req.params.id), function (err, result) 
            {
                if (err) 
                    throw err;

                res.send(result);                               
            });
         });
    } 
    catch (err) {
        console.error(`Error while deleting programming languages `, err.message);
        next(err);
    }    
});

//Not implemented 
//PATCH: Update Object
//app.patch()
