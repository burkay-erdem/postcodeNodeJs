const express = require('express')
const app = express()
const port = 3000

var axios = require('axios');

const States = () => {

    var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://public-sdc.trendyol.com/discovery-web-accountgw-service/api/locations/cities?culture=tr-TR&storefrontId=1',
        headers: {}
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data.result));
            response.data.result.forEach(element => {
                var config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `https://public-sdc.trendyol.com/discovery-web-accountgw-service/api/locations/city/${element.id}/districts?culture=tr-TR&storefrontId=1`,
                    headers: {}
                };

                axios(config)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data.result));
                        response.data.result.forEach(el => {
                            var config = {
                                method: 'get',
                                maxBodyLength: Infinity,
                                url: `https://public-sdc.trendyol.com/discovery-web-accountgw-service/api/locations/city/${element.id}/district/${el.id}/neighborhoods?culture=tr-TR&storefrontId=1&countryCode=TR`,
                                headers: {}
                            };

                            axios(config)
                                .then(function (response) {
                                    console.log(JSON.stringify(response.data));
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });



            });
        })
        .catch(function (error) {
            console.log(error);
        });


}


app.get('/', (req, res) => {
    try {

        States()
        console.log("Başarılı")

    } catch (error) {
        console.log('error', error)
    }
})




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})