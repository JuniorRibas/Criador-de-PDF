const puppeteer = require('puppeteer');
const fs = require("fs-extra");
const hbs = require('handlebars')
const path = require('path')
const moment  = require('moment')
const data = require('./dados');


(async function(){
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        const content = await compile('shot-list', data)
       
        await page.setContent(content)
        await page.emulateMedia('screen')

        await page.pdf({
            path : 'meuPdf.pdf',
            format : 'A4',
            printBackground: true
        })
        console.log('Feito....')
        await browser.close()
        process.exit()
    } catch (error) {
        console.log("Error ", error)
    }


})();




hbs.registerHelper('formatDate', function(value, format){
    return moment(value).format(format);
})

const compile = async function(templateName, data){
    const filePath = path.join(process.cwd(), 'templates', templateName +".hbs");
    const html = await fs.readFile(filePath, 'utf-8');
    
    return hbs.compile(html)(data);
}


  

