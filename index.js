
const express = require("express");
const pg=require("pg").Pool;
const bodyParser = require('body-parser'); 
const Json2csvParser = require("json2csv").Parser;

const app = express();

const pool=new pg({host:'localhost',database:'nyc',user:'postgres',password:'postgres',port:'5432',ssl:false});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 

const _port = process.env.PORT || 5000;
const _app_folder = __dirname + '/dist' ;
app.use(express.static(__dirname + '/dist' ));
app.get("/api/data",function(req,res)
{
    pool.query("SELECT jsonb_build_object('type','FeatureCollection','features', jsonb_agg(feature)) FROM (SELECT jsonb_build_object('type','Feature','id',id,'geometry',ST_AsGeoJSON(geom)::jsonb, 'properties', to_jsonb(row) - 'gid' - 'geom') AS feature  FROM (SELECT * FROM zones) row) features;", (err1, res1) => 
        {   
            if(err1) {return console.log(err1);}
            //res.setHeader('content-type', 'application/json');
            //res.setHeader('charset','utf-8');            
            res.json(res1.rows[0]["jsonb_build_object"]);
            
            
            
        });         
});

app.post('/query', function(request, response){
    console.log(request.body);
    pool.query("SELECT z2.id as destination_zone, count(*) as total_trips FROM yellow t FULL JOIN zones z1 ON ST_Contains((select geom from zones where id='"+request.body.id+"'), t.l_pickup) FULL JOIN zones z2 ON ST_Contains(z2.geom, t.l_dropoff) WHERE t.pickup_datetime >= '"+request.body.s_date+"' and t.pickup_datetime < '"+request.body.e_date+"' GROUP BY z2.id ORDER BY total_trips desc", (err1, res1) => 
      {
        const jsonData = JSON.parse(JSON.stringify(res1.rows));
        console.log("jsonData", jsonData);
    
        const json2csvParser = new Json2csvParser({ header: true});
        const csv = json2csvParser.parse(jsonData);
        console.log(csv);        
        response.set('Content-Type', 'application/octet-stream');
        response.setHeader('Content-Disposition', 'attachment; filename=result.csv');
        response.send(csv);
      });
});

app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, {root: _app_folder});
});

app.listen(_port, function () {
    console.log("Node Express server for " + app.name + " listening on http://localhost:" + _port);
});