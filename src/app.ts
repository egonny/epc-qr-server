import { EpcQrController } from './routes/EpcQrController';
import express from 'express';

const app = express();

const port = process.env.PORT || 3000;

app.use('/', EpcQrController);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});