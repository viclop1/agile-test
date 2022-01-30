# Agile Test API
REST API for a small shop made in Node.

**Features:**

 - RESTful routing
 - Stateless communication
 - Filtering/Paging/Sorting 
 - Basic header authorization

# Routes
*All requests must be authorized with [basic header authorization](https://en.wikipedia.org/wiki/Basic_access_authentication)

Base URL: **api/**

**Auth**
|Method|Route|Action|Description| 
|---|---|---|---|
|POST|login|authController::login| Login into the app

**Users**
|Method|Route|Action|Description| 
|---|---|---|---|
|POST|users|userController.createUser|Create a new user
|GET|users|userController.getUsers|Gets all users
|GET|users/{userId}|userController.getUserById|Gets a existing user by id
|PUT|users/{userId}|userController.updateUser|Update a existing user by id
|PUT|users/{userId}/role|userController.updateUserRole|Update a role from existing user
|DELETE|users/{userId}|userController.deleteUser|Delete a existing user

**Customer**
|Method|Route|Action|Description| 
|---|---|---|---|
|POST|customers|customerController.createCustomer|Creates a new customer.
|POST|customers/csv|customerController.createCustomersByCsv|Creates new customers reading a given csv.
|GET|customers|customerController.getCustomers|Gets all customers of user, can be filtered/sorted/paged.
|GET|customers/{customerId}|customerController.getCustomerById|Get an existing customer by id.
|GET|customers/creator/{creatorId}|customerController.getCustomersByCreator|Get customers by creator id.
|GET|customers/updater/{updaterId}|customerController.getCustomersByUpdater|Get customers by updater id.
|PUT|customers/{customerId}|customerController.updateCustomer|Updates an existing customer.
|DELETE|customers/{customerId}|customerController.deleteCustomer|Deletes an existing customer.

**Packages:**
 - bcryptjs (https://www.npmjs.com/package/bcryptjs)
 - cors (https://www.npmjs.com/package/cors)
 - csv-parse (https://www.npmjs.com/package/csv-parse)
 - dotenv (https://www.npmjs.com/package/dotenv)
 - express (https://www.npmjs.com/package/express)
 - express-validator (https://www.npmjs.com/package/express-validator)
 - helmet (https://www.npmjs.com/package/helmet)
 - jsonwebtoken (https://www.npmjs.com/package/jsonwebtoken)
 - loglevel (https://www.npmjs.com/package/loglevel)
 - mongoose (https://www.npmjs.com/package/mongoose)
 - mongoose-paginate (https://www.npmjs.com/package/mongoose-paginate)
 - morgan (https://www.npmjs.com/package/morgan)
 - nodemailer (https://www.npmjs.com/package/nodemailer)
 - valid-url (https://www.npmjs.com/package/valid-url)

**Created by**
Víctor López