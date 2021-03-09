
const mongodb = require("mongodb");
const http = require('http');
const uri = "mongodb://admin:Prince1512@104.197.54.59:27017/"; 

mongodb.MongoClient.connect(uri, async(err, db) => {
    if (err != null) {
        console.log(err);
    }
    console.log("Start - " + new Date());
    let dbo = db.db("checkthisproperty");
    let c = 0;
    let res1 = await dbo.collection("adhoc").findOneAndDelete({});
    let add =  dbo.collection("address").find().skip(res1.value.offset).limit(10000).toArray(function(err, result) {
        if (err) throw err;
        if(result !=null){  
           
            result.forEach(async doc => {
                c++;          
                     var document = await dbo.collection("Lot").findOne({
                         geometry: {
                                 $geoIntersects: {
                                     $geometry: {
                                         type: "Point",
                                         coordinates: doc.coordinates,
                                     }
                                 }
                             }
                         });
                     
                         if(document!=null){
                           
                             let tt = {};
                             tt.itslotid = document.properties.itslotid;
                             tt.address = doc.address;
                             tt.coordinates = doc.coordinates;
                             tt.type = doc.type;
                             tt.lot = document.geometry;
                             //console.log(tt);
                            http.get('http://104.197.54.59:8580/insert?data='+JSON.stringify(tt), (resp) => {});
                             
                             console.log("Stop - " + new Date());
                         }
            })
        }
       
      });

    });
  

