import nextConnect from 'next-connect';
import apiAuth from '../../common/lib/authentication';
import clientPromise from '../../middleware/database';

const handler = nextConnect();
const TCNN = 'Transactions';

handler.get(async (req: any, res: any) => {
  let { node, searchBy, searchValue, sortBy, sortOrder, seed, limit } = req.query;


  const checkSession = await apiAuth(req, res);
  if (!checkSession) {
    return;
  }
  try {
    sortOrder = parseInt(sortOrder);
    seed = parseInt(seed);
    limit = parseInt(limit);
    const client: any = await clientPromise;
    const db = client.db(node);

    let filterObj: any = {};
    if (searchBy && searchValue) {
      filterObj[searchBy] = searchValue;
    }

    let sortObj: any = { createdAt: -1 };
    if (sortBy && sortOrder && !isNaN(sortOrder)) {
      sortObj = { [sortBy]: Number(sortOrder) }
    }

    if (!seed) {
      seed = 0;
    }
    limit = Number(limit)
    if (!limit || isNaN(limit)) {
      limit = 5;
    }
    let result = await db.collection(TCNN).aggregate([
      { '$match': filterObj },
      { $project: { _id: 0 } },
      { $sort: sortObj },
      {
        $facet: {
          count: [{ $count: 'count' }],
          list: [{ $limit: seed + limit }, { $skip: seed }],
        },
      },
    ]);

    if (result) {
      console.info('Fetched transactions from DB');
      const resp: any = {};
      for await (const doc of result) {
        resp.total = doc.count[0]?.count;
        resp.list = doc.list;
      }
      res.json({
        code: 0,
        data: resp,
      });
    } else {
      res.json({ code: 1, message: `Transactions retrieval failed` });
    }

  } catch (err: any) {
    console.log(err)
    res.json({ code: 1, message: `Transactions retrieval failed: ${err.message}` });
  }

});

export default handler;