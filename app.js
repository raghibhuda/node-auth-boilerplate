import http from 'http';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './server/routes';
import cors from 'cors';
import helmet from 'helmet';


const hostname = '127.0.0.1';
const port = 8000;
const app = express();
const server = http.createServer(app);


app.use(helmet()); 
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



routes(app);

app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the REST API Boilerplate',
}));

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});



module.exports = app;