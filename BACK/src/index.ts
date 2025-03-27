import 'reflect-metadata';
import app from './server';
import { config } from './config/config';
import { AppDataSource } from './config/data-source';


const PORT = config.app.port

AppDataSource.initialize()
    .then(() => {
        console.log('DB Connected')
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    })
    .catch((error) => console.error('DB Error', error))
