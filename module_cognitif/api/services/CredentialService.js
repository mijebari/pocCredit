/**
 * Created by rlespagnol on 29/04/2016.
 */

const request = require('request');

module.exports = {
    getCredentials: function (lang) {
        if (!lang || lang === 'fr') {
            return {
                url: 'https://gateway.watsonplatform.net/dialog/api',
                username: '630cc3f1-7df6-41ca-a3a3-740ad8a037ba',
                password: '1ARiUAsk6Hb3',
                version: 'v1'
            }
        }

        return {
            url: 'https://gateway.watsonplatform.net/dialog/api',
            username: '83c61bbd-6c2e-4a92-b924-807e321afcb4',
            password: 'YOda0hQRbiJ8',
            version: 'v1'
        }
    },
    getNLCCredentials: function (lang) {
        if (!lang || lang.toLowerCase() === 'fr') {
            return {
                url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
                username: '5d334ca5-6e95-40e5-b3d0-7e367ccfed21',
                password: 'KYVSnzYj0VGW',
                version: 'v1'
            }
        }

        return {
            url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
            username: '354b4b56-5b81-44d2-ae42-67d5ca459ba8',
            password: 'oZ5WjSQZ1hdj',
            version: 'v1'
        }
    },
    getConversationCredentials: function () {
        // // Dev
        // return {
        //     url: 'https://gateway.watsonplatform.net/conversation/api',
        //     username: 'c549b055-04ed-4068-acde-62803643613c',
        //     password: 'MKlOw3goVAnS',
        //     version: 'v1',
        //     version_date: '2016-09-20'
        // }

        // Prod
        return {
            url: 'https://gateway.watsonplatform.net/conversation/api',
            username: 'db4599a3-6f09-45ce-9013-be76c2ba29aa',
            password: 'o2FZUBsicRmd',
            version: 'v1',
            version_date: '2016-09-20'
        }
    },
    getAlchemyAPIKey: function (cb) {
        const free_api_key = 'eaafbb3e4d0d466d8d488e566b8238872d6f5779';
        const free_api_key_v2 = '6ffd3b1c04fcad83819df64dd3150c948c30e385'
        const standard_api_key = '05397a1fd92ee986eab13923bfd09171a0068e8d';

        request({
            url: 'http://access.alchemyapi.com/calls/info/GetAPIKeyInfo',
            method: 'GET',
            qs: {
                apikey: free_api_key,
                outputMode: 'json'
            }
        }, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                var obj = JSON.parse(body);
                if(parseInt(obj.consumedDailyTransactions) < 950)
                    return cb(null, {api_key: free_api_key});
            }

            return cb(null, {api_key: standard_api_key});

        })
    },
          getRetrieveAndRankCredentials: function () {
        // Dev
        return {
  username: "f472edc3-82f6-4726-bf82-a401e7d84a26",
  password: "5723oOoy44Bm",
  version: 'v1'
};

    },
};