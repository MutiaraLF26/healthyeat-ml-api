const tf = require('@tensorflow/tfjs-node');
const loadModel = require('../utils/loadModel');
const path = require('path');
const { status } = require('express/lib/response');


// function base64ToBuffer(base64) {
//     const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
//     if (!matches || matches.length !== 3) {
//         throw new Error('Invalid input string');
//     }
//     return Buffer.from(matches[2], 'base64');
// }

function base64ToBuffer(base64) {
    return Buffer.from(base64.split(',')[1], 'base64');
}

async function imgPredict(req, res) {
    // const classes = ['Apple Braeburn', 'Apple Crimson Snow', 'Apple Golden 1', 'Apple Golden 2', 'Apple Golden 3', 'Apple Granny Smith', 'Apple Pink Lady', 'Apple Red 1', 'Apple Red 2', 'Apple Red 3',
    //     'Apple Red Delicious', 'Apple Red Yellow 1', 'Apple Red Yellow 2', 'Apricot', 'Avocado', 'Avocado ripe', 'Banana', 'Banana Lady Finger', 'Banana Red', 'Beetroot', 'Blueberry', 'Cactus fruit',
    //     'Cantaloupe 1', 'Cantaloupe 2', 'Carambula', 'Cauliflower', 'Cherry 1', 'Cherry 2', 'Cherry Rainier', 'Cherry Wax Black', 'Cherry Wax Red', 'Cherry Wax Yellow', 'Chestnut', 'Clementine', 'Cocos',
    //     'Corn', 'Corn Husk', 'Cucumber Ripe', 'Cucumber Ripe 2', 'Dates', 'Eggplant', 'Fig', 'Ginger Root', 'Granadilla'];
    
        const classes = [
            "Apple Braeburn", "Apple Crimson Snow", "Apple Golden 1", "Apple Golden 2",
            "Apple Golden 3", "Apple Granny Smith", "Apple Pink Lady", "Apple Red 1",
            "Apple Red 2", "Apple Red 3", "Apple Red Delicious", "Apple Red Yellow 1",
            "Apple Red Yellow 2", "Apricot", "Avocado", "Avocado ripe", "Banana",
            "Banana Lady Finger", "Banana Red", "Beetroot", "Blueberry", "Cactus fruit",
            "Cantaloupe 1", "Cantaloupe 2", "Carambula", "Cauliflower", "Cherry 1",
            "Cherry 2", "Cherry Rainier", "Cherry Wax Black", "Cherry Wax Red",
            "Cherry Wax Yellow", "Chestnut", "Clementine", "Cocos", "Corn", "Corn Husk",
            "Cucumber Ripe", "Cucumber Ripe 2", "Dates", "Eggplant", "Fig", "Ginger Root",
            "Granadilla", "Grape Blue", "Grape Pink", "Grape White", "Grape White 2",
            "Grape White 3", "Grape White 4", "Grapefruit Pink", "Grapefruit White", "Guava",
            "Hazelnut", "Huckleberry", "Kaki", "Kiwi", "Kohlrabi", "Kumquats", "Lemon",
            "Lemon Meyer", "Limes", "Lychee", "Mandarine", "Mango", "Mango Red", "Mangostan",
            "Maracuja", "Melon Piel de Sapo", "Mulberry", "Nectarine", "Nectarine Flat",
            "Nut Forest", "Nut Pecan", "Onion Red", "Onion Red Peeled", "Onion White",
            "Orange", "Papaya", "Passion Fruit", "Peach", "Peach 2", "Peach Flat", "Pear",
            "Pear 2", "Pear Abate", "Pear Forelle", "Pear Kaiser", "Pear Monster", "Pear Red",
            "Pear Stone", "Pear Williams", "Pepino", "Pepper Green", "Pepper Red", "Pepper Yellow",
            "Physalis", "Physalis with Husk", "Pineapple", "Pineapple Mini", "Pitahaya Red", "Plum",
            "Plum 2", "Plum 3", "Pomegranate", "Pomelo Sweetie", "Potato Red", "Potato Red Washed",
            "Potato Sweet", "Potato White", "Quince", "Rambutan", "Raspberry", "Redcurrant", "Salak",
            "Strawberry", "Strawberry Wedge", "Tamarillo", "Tangelo", "Tomato 1", "Tomato 2", "Tomato 3",
            "Tomato 4", "Tomato Cherry Red", "Tomato Heart", "Tomato Maroon", "Tomato not Ripened",
            "Tomato Yellow", "Walnut", "Watermelon"
        ];
        

        try {
        if (!req.file) {
            throw {
                name: "badRequest",
                message: "All field must be filled",
            };
        }

        const model = await loadModel.loadModelStorage();

        const fileBase64 = req.file.buffer.toString('base64');
        const file = `data:${req.file.mimetype};base64,${fileBase64}`;
        const imageBuffer = base64ToBuffer(file);

        const tfImg = tf.node.decodeImage(imageBuffer, 3)
            .resizeNearestNeighbor([100, 100])
            .expandDims()
            .toFloat()
            .div(tf.scalar(255.0)); // Normalisasi gambar jika diperlukan

        // Tentukan input shape jika diperlukan
        const input = tf.input({ shape: [100, 100, 3] });
        const prediction = model.predict(tfImg);
        const scores = prediction.dataSync();
        // const topPrediction = Array.from(scores).indexOf(Math.max(...scores));
        const maxScore = Math.max(...scores);
        const topPrediction = Array.from(scores).indexOf(maxScore);
        // const predictedClass = classes[topPrediction];
        const predictedClass = maxScore < 0.6 ? "Unknown" : classes[topPrediction];
        const totalProbability = scores.reduce((acc, score) => acc + score, 0);

        res.status(200).json({
            name: "success",
            status: 200,
            message: "Prediction Success",
            data: {
                predict: topPrediction,
                class: predictedClass,
                totalProbability: totalProbability,
                scores: scores,
            },
        });
    } catch (err) {
        console.error('Error processing image:', err.message);
        res.status(500).json({
            name: "error",
            status: 500,
            message: "Error processing image",
            data: {
                error: err.message,
            },
        });
    }

}

module.exports = { imgPredict };
