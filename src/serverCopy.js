const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const Joi = require('joi');
const port =process.env.PORT || 3000;
const courses = [
    {id:1, name:'course1'},
    {id:2, name:'course2'},
    {id:3, name:'course3'},
    {id:4, name:'course4'}
];

//Create a Express instance
const app = express();

/*  4xx client error – the request contains bad syntax or cannot be fulfilled. 
    Server error codes:
    //400 Bad Request
    //401 Unauthorized
    //402 Payment Required 
    //403 Forbidden
    //404 Not found
    //405 Method Not Allowed
    //406 Not Acceptable
    //407 Proxy Authentication Required
    //418 I'm a teapot
    //431 Request Header Fields Too Large
    //451 Unavailable For Legal Reasons
*/

/*GET : Get object
PUT : Modify Object
DELETE: Delete Object
POST : Create Object*/

//GET http://localhost:3000/api/courses
//POST http://localhost:3000/api/courses/ -> name i bodyn


// ✅ Register the body parsing middleware here
app.use(express.json())
app.use(
    express.urlencoded({
    extended: true,
  }),
);

app.use(cors());
 

app.listen(port, () => {
    console.log("Listening on port "+port);
});

//GET : Get object
app.get('/', (req, res) => {
    console.log("GET on Server side");
    res.send('Hello from server');
})

app.get('/api/courses', (req, res) =>  {
    res.send(courses);    
})

app.get('/api/courses/:id', function(req, res) {  
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        //404 Not found
        return res.status(404).send("The course with the given ID was not found!");  
    }  
    res.send(course);    
})

app.get('/api/posts/:year/:month', (req, res) => {     
    res.send(req.query);
});

//User-defined function to validate the course
function validateCourse(course){ 
    const schema = Joi.object({
        name: Joi.string().min(5).max(25).required().messages({
            'string.base': `"Name" should be a type of 'text'`,
            'string.empty': `"Name" cannot be an empty field`,
            'string.min': `"Name" should have a minimum length of {#limit}`,
            'any.required': `"Name" is a required field`
        })        
    });
    return schema.validate({name: course}, { abortEarly: false });
}

//Add a course after validating
app.post('/api/courses', (req, res) =>{         
    const {error} = validateCourse(req.body.name); 
    if(error){
        //400 Bad Request
        return res.status(400).send(error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

//PUT : Modify Object
app.put('/api/courses/:id', (req, res) =>{
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
app.delete('/api/courses/:id', (req, res) =>{
   const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        return res.status(404).send("The course with the given ID was not found!");          
    } 
    
    //Delete
    const index= courses.indexOf(course);
    courses.splice(index, 1);

    // return the deleted course to client
     res.status(200).send(course);
});

//PATCH: Update Object
//app.patch()

/*//POST : Create Object
app.post('/enroll', function(req, res){
    console.log("POST on Server side, userName= "+req.body.userName+", email= "+req.body.email+", subscribe=" +req.body.subscribe + ", Password= "+req.body.password+", confirmPassword= "+req.body.confirmPassword+", city= "
    +req.body.address.city+", state= "+req.body.address.state +" , postalCode= "+req.body.address.postalCode);     
    //Send a response to the client 
    res.status(200).send({"message": "Server has received data!"});    
})*/