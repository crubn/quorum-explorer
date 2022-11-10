const { model, Schema } = require('mongoose');

const NodeCollectionName = 'Nodes';

const NodeSchema = new Schema(
    {
      name: { type: String, required: true, unique: true },
      lastBlockVisited: { type: String, required: true },
    },
    {
      collection: NodeCollectionName,
      versionKey: false,
      timestamps: true,
    },
);


const Nodes = model(NodeCollectionName, NodeSchema);

module.exports= { NodeCollectionName, Nodes };

