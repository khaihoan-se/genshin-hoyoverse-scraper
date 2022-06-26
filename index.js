import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { getKeyFeatures, getAllCharacter } from './scraper.js'

dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
dotenv.config();
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use('/', (req, resp) => {
    resp.json('hello word')
})
app.use('/api/genshin-impact/key-features', (req, resp) => {
    try {
        getKeyFeatures().then(key => {
            resp.status(200).json(key);
        })
    } catch (error) {
        resp.status(500).json(error)
    }
})

app.use('/api/genshin-impact/all_character', (req, resp) => {
    const limit = Number(req.query.limit);
    try {
        getAllCharacter().then(character => {
            if (limit && limit > 0) {
                resp.status(200).json(character.slice(0, limit));
            } else {
                resp.status(200).json(character);
            }
        })
    } catch (error) {
        resp.status(500).json(error)
    }
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server runing on Port: ${PORT}`);
});
