const express = require('express');
//const cors = require('cors');
const mysql = require('mysql2');
const Joi = require('joi');
const port =process.env.PORT || 3000;

// Create a connection to your MySQL database
var connection = mysql.createConnection({
    host: 'db4free.net', // replace with your host name
    user: 'vellinge',      // replace with your MySQL username
    password: '0LEQ&xk4&hVXyrQR',      // replace with your MySQL password
    database: 'leqxkhvxyrqr'   // replace with your MySQL database name
  });
 
//Create a Express instance
const app = express();



/*GET : Get object
PUT : Modify Object
DELETE: Delete Object
POST : Create Object*/


// ✅ Register the body parsing middleware here
app.use(express.json())
app.use(
    express.urlencoded({
    extended: true,
  }),
);

//app.use(cors());
 

app.listen(port, () => {
    console.log("Listening on port "+port);
});

//GET : Get object
app.get('/', async function(req, res)
{   console.log("GET on Server side");
    res.send("Hello from server!");    
})

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

app.get('/api/programming_languages/:id', async function(req, res) {  
    try 
    {
        connection.connect(function(err) 
        {
            if (err) 
              throw err;
            console.log("Connected to the database!");
          
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
    console.log("validateProgrammingLanguage");
    const schema = Joi.object({
        name: Joi.string().min(1).max(255).required().messages({
            'string.base': `"Name" should be a type of 'text'`,
            'string.empty': `"Name" cannot be an empty field`,
            'string.min': `"Name" should have a minimum length of {#limit}`,
            'any.required': `"Name" is a required field`
        }),
        released_year: Joi.number().min(1990).max(2030).required().messages({            
            'string.empty': `"Release year" cannot be an empty field`,
            'string.min': `"Release year" should have a minimum length of {#limit}`,
            'any.required': `"Release year" is a required field`
        })              
    });
    return schema.validate({name: programming_language.name, released_year: programming_language.released_year}, { abortEarly: false });
}

function CreateSqlString(parameter){
    let sqlstring="INSERT INTO programming_languages(name,info, released_year,githut_rank) VALUES (";
    sqlstring+='"';
    sqlstring+=parameter.name;
    sqlstring+='"';
    sqlstring+=",";
    sqlstring+='"';
    sqlstring+=parameter.info;
    sqlstring+='"';
    sqlstring+=",";
    sqlstring+=parameter.released_year;
    sqlstring+=",";
    sqlstring+=parameter.githut_rank;
    sqlstring+=")";
    //console.log(sqlstring);
    return sqlstring;
}

//Add a programming language after validating
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
            connection.query(CreateSqlString(req.body), function (err, result)       
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

//PUT : Modify Object
app.put('/api/programming_languages/:id', async function(req, res){
    //Look up this course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        return res.status(404).send("The course with the given ID was not found!");  
    }  
    
    //Validate
    const {error} = validateCourse(req.body.name);    
    if(error){
        //If invalid, return 400 - bad request
        return res.status(400).send(error.details[0].message);        
    }
    
    //Update course 
    course.name = req.body.name;
    
    // return the updated course to client
    res.status(200).send(course);
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

//PATCH: Update Object
//app.patch()
