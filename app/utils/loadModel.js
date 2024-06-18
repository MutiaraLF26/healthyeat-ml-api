const tf = require('@tensorflow/tfjs-node');
const path = require('path');

async function loadModel() {
    return tf.loadGraphModel(process.env.MODEL_URL);
}

async function loadModelStorage() {
    const modelPath = 'https://storage.googleapis.com/model-ml-healthyeat/ML/tfjs_target_directory/model.json';
    const model = await tf.loadLayersModel(modelPath);
    return model;
}

async function loadModelLocal() {
    const modelPath = path.resolve(__dirname, '../models/tfjs_target_directory/model.json');
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    return model;
}

module.exports = {
    // loadModel,
    loadModelStorage,
    loadModelLocal,
    loadModel,
};