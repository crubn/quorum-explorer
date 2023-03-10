import axios from 'axios';
import nextConnect from 'next-connect';
import apiAuth from '../../common/lib/authentication';
import clientPromise from '../../middleware/database';

const handler = nextConnect();
const LocationDB = 'locations';
const CollectionName = 'Nodes';
const millisecondsIn24Hours = 86400000;
const geoLocationApi='http://www.geoplugin.net/json.gp?ip='

const getLocation = (resp: any) => {
  let location = ""
  if (resp.geoplugin_city) {
    location += resp.geoplugin_city + ", "
  }
  if (resp.geoplugin_region) {
    location += resp.geoplugin_region + ", "
  }
  location += resp.geoplugin_countryName
  return location;
}

handler.get(async (req: any, res: any) => {
  let { ip } = req.query;
  ip = (new URL("http://" + ip)).hostname

  const checkSession = await apiAuth(req, res);
  if (!checkSession) {
    return;
  }
  try {
    const client: any = await clientPromise;
    const db = client.db(LocationDB);

    let filterObj: any = {};

    let result = await db.collection(CollectionName).findOne({ ip },
      async (err: any, doc: any) => {
        if (err || !doc) {
          console.log('err', err)
          let resp = await upsertLocation(ip, db);
          if (resp) {

            return res.json({
              code: 0,
              data: getLocation(resp),
            });
          } else {
            return res.json({ code: 1, message: `Location retrieval failed` });
          }
        }
        else {

          if ((doc.updatedAt - (new Date()).getTime()) > millisecondsIn24Hours) {
            let resp = await upsertLocation(ip, db);
            if (resp) {

              return res.json({
                code: 0,
                data: getLocation(resp),
              });
            }
          }
          return res.json({
            code: 0,
            data: getLocation(doc),
          });
        }
      });

  } catch (err: any) {
    console.log(err)
    res.json({ code: 1, message: `Location retrieval failed: ${err.message}` });
  }


  const upsertLocation = async (ipAddress: string, db: any) => {

    let ipData = await axios.get(geoLocationApi + ip);
    if (ipData.status === 200) {
      let doc = await db.collection(CollectionName).findOneAndUpdate({ ip: ipAddress }, {
        $set: {
          ip: ipAddress,
          updatedAt: new Date().getTime(),
          geoplugin_city:ipData.data.geoplugin_city,
          geoplugin_region:ipData.data.geoplugin_region,
          geoplugin_countryName:ipData.data.geoplugin_countryName
        }
      }, {
        new: true,
        upsert: true // Make this update into an upsert
      });

      return doc;
    }
    return null;
  }
});

export default handler;