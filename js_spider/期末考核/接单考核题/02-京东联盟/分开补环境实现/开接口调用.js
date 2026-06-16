const fs = require('fs');
const express = require('express');
const app = express();


const {
    get_h5st,
} = require('./获取h5st');

const {
    get_params,
} = require('./获取请求参数');

app.use(express.json());
app.post('/api/data', (req, res) => {
    console.log('接收到数据:', req.body["params"]);
    res.json({
        status: 'success',
        result1: get_h5st(req.body["params"]),
        result2: get_params(req.body["params"])
    });
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`服务已启动: 端口为 ${PORT} ...`);
});
