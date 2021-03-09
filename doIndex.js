
const mongodb = require("mongodb");
const uri = "mongodb://admin:Prince1512@104.197.54.59:27017/"; 

mongodb.MongoClient.connect(uri, async(err, db) => {
    if (err != null) {
        console.log(err);
    }
    console.log("Start - " + new Date());
    var dbo = db.db("checkthisproperty");
    let c = 0;
    let result = await dbo.collection("adhoc").findOneAndDelete({});
    let add = await dbo.collection("address").find().skip(result.value.offset).limit(10000);
    add.each(async function(err, doc) {
        c++;
     
       // let rr = dbo.collection('addressMain').insertOne({"test":1});
        for(i=1; i<38; i++){
            
            var r = await dbo.collection("Lot_"+i).findOne({
                geometry: {
                        $geoIntersects: {
                            $geometry: {
                                type: "Point",
                                coordinates: doc.coordinates,
                            }
                        }
                    }
                });
                if(r!=null && doc!=null){
                    console.log("Done - " + new Date());
                    let tt = {};
                    tt.itslotid = r.properties.itslotid;
                    tt.address = doc.address;
                    tt.coordinates = doc.coordinates;
                    tt.type = doc.type;
                    tt.lot = r.geometry;
                    dbo.collection('addressMain').insertOne(tt);     
                }          
        }
    })
});