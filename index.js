const url = 'https://www.wbhealth.gov.in/pages/corona/bed_availability'
const urlPvt = 'https://www.wbhealth.gov.in/pages/corona/bed_availability_pvt'


const https = require('https')
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')
const base = './pdfs/'
scrapeURL(url, 'govt')
scrapeURL(urlPvt, 'pvt')

function scrapeURL (check, folder){
	request(check, function(err, response, body) {
	    if (!err && response.statusCode == 200){
	    	// get the body
	        var $ = cheerio.load(body);

	        // get the response
	        var table = $('#rap > table > tbody > tr > td:nth-child(2) > div > table > tbody > tr > td:nth-child(1) > div > div > div > div:nth-child(3) > table > tbody')

	        var $tr = table.children('tr')

	        $tr.each(function(row){
	        	const link = $($(this).find('a')).attr('href')
	        	if (link){
		        	const nameList = link.split('/')
		        	const name = nameList[nameList.length-1]
					checkPDF(`${base}${folder}/${name}`, link)
	        	}
	        })
	        

		}
	})
}

function checkPDF(fileName, url){
	try {
	    if(fs.existsSync(fileName)) {

	    } else {
	        downloadPDF(fileName, url)
	    }
	} catch (err) {
	    console.error(err);
	}
}

async function downloadPDF(fileName, URL){
	const file = fs.createWriteStream(fileName);
	const requestFile = https.get(URL, function(response) {
	  response.pipe(file);
	});
}
