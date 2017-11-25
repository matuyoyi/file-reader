var express = require('express');
var router = express.Router();
var fs = require('fs');
var xlsx = require('node-xlsx');

/* GET home page. */
router.get('/upload', function (req, res, next) {
    res.send('index');
});
router.post('/upload', function (req, res, next) {
    const data = req.files.file;
    const fileName = data.name;
    var suffix = fileName.replace(/.+\./, '');
    let bufferData;
    if(suffix === 'csv') {
        bufferData = data.data.toString();
    }

    data.mv('./uploads/'+fileName, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        if(suffix === 'csv') {
            const fileArr = bufferData.split(/\r\n+/);
            const fileData = [];
            fileArr.forEach(element => {
                const arr = element.split(',')
                fileData.push(element.split(','))
            });
            const clomuns = fileData.shift()
            const resData = [];
            for(let i=0;i<fileData.length;i++) {
                let itemObj = {}
                for(let j=0;j<fileData[i].length;j++) {
                    var key = clomuns[j].replace(/(^\s*)|(\s*$)/g, '');
                    console.log(key)
                    var value = fileData[i][j].replace(/(^\s*)|(\s*$)/g, '');
                    eval("itemObj." + key + "='" + value + "'");
                    if(j === fileData[i].length - 1) {
                        resData.push(itemObj)
                    }
                }
            }
            const data = {
                clomuns,
                data: resData
            }
            res.send(data);
        } else {
            // else todo fs -> read file
            res.send('ok')
        }
    });
})
module.exports = router;
