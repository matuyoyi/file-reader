var express = require('express');
var router = express.Router();
var fs = require('fs');
var xlsx = require('node-xlsx');

/* GET home page. */
router.get('/upload', function (req, res, next) {
    res.send('index');
});
router.post('/upload', (req, res, next) => {
    const data = req.files.file;
    const fileName = data.name;
    var suffix = fileName.replace(/.+\./, '');
    if(suffix === 'csv') {
        const bufferList = data.data.toString().split(/\r\n+/); // convert buffer to String[]
        const fileData = [];
        bufferList.forEach(element => {
            const arr = element.split(',');
            fileData.push(element.split(','));
        });
        const clomuns = fileData.shift();
        const resData = [];
        for(let i=0;i<fileData.length;i++) {
            let itemObj = {}
            for(let j=0;j<fileData[i].length;j++) {
                var key = clomuns[j].replace(/(^\s*)|(\s*$)/g, '');
                var value = fileData[i][j].replace(/(^\s*)|(\s*$)/g, '');
                eval("itemObj." + key + "='" + value + "'");
                if(j === fileData[i].length - 1) {
                    resData.push(itemObj);
                }
            }
        }
        const data = {
            clomuns,
            data: resData
        }
        res.send(data);
    } else if (suffix === 'xlsx') {
        const sheetsList = xlsx.parse(data.data);
        console.log(sheetsList)
        let originalData;					// buffer.data
        let timeIndex;					// Index of time column
        const headerArr = []; 			// columns
        const fileData = [];			// responese data
        for (let i = 0; i < sheetsList.length; i++) {
            if(sheetsList[i].data.length > 0) {
                originalData = sheetsList[i].data;
            }
        }
        for (var i = 0; i < originalData.length; i++) {
            for (var j = 0; j < originalData[i].length; j++) {
                if(i === 0) {
                    headerArr.push(originalData[i][j])
                    if(originalData[i][j].indexOf('时间') > -1
                    || originalData[i][j].indexOf('日期') > -1
                    || originalData[i][j].indexOf('time') > -1
                    || originalData[i][j].indexOf('date') > -1) {
                        timeIndex = j;
                    }
                }
                if (timeIndex) {
                    if(!isNaN(originalData[i][timeIndex])) {
                        originalData[i][timeIndex] = (new Date(1900, 0, originalData[i][timeIndex])).toLocaleString();
                    }
                }
            }
        }
        originalData.shift();
        for (let i = 0; i < originalData.length; i++) {
            let excelRowData = {};
            for (let j = 0; j < originalData[i].length; j++) {
                excelRowData[headerArr[j]] = originalData[i][j];
            }
            generateData(excelRowData);
        }
        function generateData(data) {
            fileData.push(data);
        }
        res.send({
            clomuns: headerArr,
            data: fileData
        });
        for (let i = 0; i < fileData.length; i++) {
            for(let value in fileData[i]) {
                if(value === '时间') {
                    if(fileData[i][value].length>8) {
                        var tempData = fileData[i][value].replace(/[:\s-\\]/g, '');
                        let time = tempData.slice(8);
                        if(parseInt(time) >= 90000) {
                            let emailAddress = fileData[i].邮箱;
                            let currentNum = fileData[i].工号;
                            let currentName = fileData[i].姓名;
                            let currentTime = fileData[i].时间;
                            sendMail({emailAddress, currentNum, currentName, currentTime});
                        }
                    }
                }
            }
        }
    }
})
function sendMail(param) {
	nodemailer.createTestAccount((err, account) => {
	    // create reusable transporter object using the default SMTP transport
	    let transporter = nodemailer.createTransport({
	        host: 'smtp.163.com',
	        port: 465,
	        auth: {
	            user: 'wtu_chennan@163.com', // generated ethereal user
	            pass: 'wtu4b520'  // generated ethereal password
	        }
	    });

	    // setup email data with unicode symbols
	    let mailOptions = {
	        from: '"chen nan 👻" <wtu_chennan@163.com>', // sender address
	        to: param.emailAddress, // list of receivers
	        subject: 'Hello ✔', // Subject line
	        text: 'Hello world?', // plain text body
	        html: `<p>工号${param.currentNum}-${param.currentName} 记录异常，</p><p>异常记录：<b>${param.currentTime}</b></p>` // html body
	    };
	    // send mail with defined transport object
	    transporter.sendMail(mailOptions, (error, response) => {
	        if (error) {
	            console.log(error);
	        } else {
	        	console.log(response)
	        }
	    });
	});
}

module.exports = router;
