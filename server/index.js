const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;


app.use(cors());
app.use(express.json());



app.get('/',(req,res)  => {
   console.log(res.send("Hello dari server!"));


});
  
app.get('/api/products',(req,res) => {
    const produk = [
        {
            id: 1,
            name: 'woterl',
            price: 10000,
        },
        {
            id: 2,
            name: 'brokoli 2',
            price: 20000,
        },
    ];
    res.json(produk);
}
)


app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
}
);


