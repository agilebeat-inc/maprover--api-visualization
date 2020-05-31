'use strict';

const tf = require('@tensorflow/tfjs');
const { createCanvas, Image } = require('canvas')

const modelLoader = (function () {
    const modelURL = 'https://tfjs-model-tutorial.s3.amazonaws.com/tfjs-models/';
    var models = {};

    async function createModel(model_name) {
        var model = await tf.loadLayersModel(modelURL + model_name + '/model.json');
        return model;
    };

    return {
        getModel: async function (model_name) {
            if (!(model_name in models)) {
                models[model_name] = await createModel(model_name);
            }
            return models[model_name];
        }
    }
}) ();

module.exports.inferHandler = async (event, context) => {
    function toBase64FromImageData(data) {
        var canvas = createCanvas(256, 256);
        var context = canvas.getContext('2d');
        canvas.height = data.height;
        canvas.width = data.width;
      
        var context = canvas.getContext('2d');
        context.putImageData(data, 0, 0);
      
        var base64Data = canvas.toDataURL();
        return base64Data;
    };
      
    function toImageDataFromBase64(string) {
        var image = new Image();
        image.onload = function () {};
        image.src = string;
      
        var canvas = createCanvas(256, 256);
        var context = canvas.getContext('2d');
        var height = image.height;
        var width = image.width;
      
        canvas.width = width;
        canvas.height = height;
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0);
      
        return context.getImageData(0, 0, width, height);
    };

    function imageByteArray(image, numChannels) {
        const pixels = image.data
        const numPixels = image.width * image.height;
        const values = new Float32Array(numPixels * numChannels);
      
        for (let i = 0; i < numPixels; i++) {
          for (let channel = 0; channel < numChannels; ++channel) {
            values[i * numChannels + channel] = pixels[i * 4 + channel]/255;
          }
        }

        return values
    };

    function imageToInput (image, numChannels) {
        const values = imageByteArray(image, numChannels)
        const outShape = [image.height, image.width, numChannels];
        const input = tf.tensor3d(values, outShape, 'float32');
        const batch_input = tf.expandDims(input, 0)
      
        return batch_input
    };

    function extractModel(event) {
        var urlPath = event.path;
        var model_name = urlPath.split("/")[2];
        return model_name;
    }

    var event_body = JSON.parse(event.body)
    var tile_fullstr = "data:image/png;base64," + JSON.stringify(event_body.tile_base64);
    var imageData = toImageDataFromBase64(tile_fullstr);
    var input = imageToInput(imageData, 4);
    var model_name = extractModel(event);
    const model = await modelLoader.getModel(model_name);
    var prediction = model.predict(input);
    var clsftion = prediction.dataSync();
    var isFeature;

    if (clsftion[0] < clsftion[1]) { 
        isFeature = false;
    } else {
        isFeature = true;
    }

    var the_body = {};
    the_body[model_name] = isFeature;

    const response = {
        statusCode: 200,
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify(the_body)
    }; 
    return response;
};