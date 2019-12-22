import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


    
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/filteredimage", async ( req, res ) => {
    if(!req.query.image_url){
      return res.status(400)
                  .send(`query image_url is required`);
    }
    let image_url = req.query.image_url;
    let ext = path.extname(image_url);
    let exts = [".jpg",".png"];
    if(exts.indexOf(ext) == -1){
      return res.status(400)
                  .send(`query image_url wrong ext`);
    }
    let image = ""
    try {
      image  = await filterImageFromURL(image_url);
      res.sendFile(image);
      
    } catch (error) {
      console.log(error);
      res.send("There was an error proccesing");
    }

    res.end = function(chunk?: any, encodingOrCb?: string | Function, cb?: Function): void {

      fs.unlink(image, (err) => {
        if (err) throw err;
        console.log("successfully deleted " +image);
      });
    }

    
  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {

      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();