const vision = require("@google-cloud/vision")
const poppler = require('pdf-poppler');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { DateTime } = require('luxon');

const argv = yargs
  .option('file', {
    alias: 'f',   
    describe: 'File to read',
    demandOption: true, 
    type: 'string',      
  })
  .argv;


const client = new vision.ImageAnnotatorClient({
  keyFilename: "./google-key.json"
})

const convertPageToPGJ = async (pdfPath) => {
  const outputDirectory = path.join(__dirname, 'tmp');

  const pdfOptions = {
    format: 'jpeg',
    out_dir: outputDirectory, 
  };

  const images = await poppler.convert(pdfPath, pdfOptions);

  return images
}

convertPageToPGJ(argv.file)
.then(async () => {
  const texts = await Promise.all(fs.readdirSync("./").map(f => {
    if(f.endsWith('jpg')){
      return client
      .textDetection(f)
      .then((results) => {
        const detections = results[0].textAnnotations;
        fs.unlinkSync(f)
        return detections.map(a => a.description).join(' ')
      })
      .catch((err) => {
        console.error(err)
      })}
  }))

  const fileName = DateTime.now().toFormat('yyyy-LL-dd_HH-mm-ss') + '.txt'
  fs.writeFileSync(fileName, texts.join(' '))
  console.log("Your file was been created in" + fileName)
})

