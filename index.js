const server = require('./api/server');

const port = 5000;

// START YOUR SERVER HERE
//console.log('hello')
 server.listen(port, () => {
    console.log('Server running on port 5000')
 })