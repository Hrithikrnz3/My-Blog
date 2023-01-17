import express from 'express';
import { db, connectToDb} from './db.js'
const app = express();
app.use(express.json());

app.get('/api/articles/:name', async(req,res) => {
    console.log("hello")
    const {name} = req.params;
    const article = await db.collection('articles').findOne({name});
    if(article)
    {
        res.json(article);
    }
    else{
        res.sendStatus(404)
    }
    
})

app.put('/api/articles/:name/upvote',async(req,res)=>
{
    const {name} = req.params;
    await db.collection('articles').updateOne({name},
        {
            $inc : { upvotes: 1},
        });
        const article = await db.collection('articles').findOne({name});
        if(article)
        {
            res.send(`${name} article has ${article.upvotes} upvotes now !!`)
        }
        else{
            res.send("the article doesnt exist");
        }

})

app.post('/api/articles/:name/comments', async(req,res) =>
{
    const { name } = req.params;
    const { postedBy, text} = req.body;
    await db.collection('articles').updateOne({name},
        {
            $push: {comments : {postedBy , text}},
        })
        const article = await db.collection('articles').findOne({name});
        
        if (article)
        {
            res.send(article.comments);
        }
        else{
            res.send("the article doest exist");
        }
})
connectToDb(()=>
{
    app.listen(80);
})

