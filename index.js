const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
var axios = require('axios');
const { response } = require('express');



const States = async () => {


    const { data: { result: cities } } = await axios({
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://public-sdc.trendyol.com/discovery-web-accountgw-service/api/locations/cities?culture=tr-TR&storefrontId=1',
        headers: {}
    })
    console.log('cities: ', cities);

    const districts = await cities.reduce(async (accProm, city) => {
        const acc = await accProm;
        const districtsRes = await axios({
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://public-sdc.trendyol.com/discovery-web-accountgw-service/api/locations/city/${city.id}/districts?culture=tr-TR&storefrontId=1`,
            headers: {}
        })
        console.log('city: ', city.name);

        return [...acc, ...districtsRes.data.result.map(m => ({ ...m, cityId: city.id, }))]
    }, Promise.resolve([])); 

    const neighborhoods = await districts.reduce(async (accProm, district) => {
        const acc = await accProm
        const neighborhoodsRes = await axios({
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://public-sdc.trendyol.com/discovery-web-accountgw-service/api/locations/city/${district.cityId}/district/${district.id}/neighborhoods?culture=tr-TR&storefrontId=1&countryCode=TR`,
            headers: {}
        })

        console.log('district: ', district.name);

        return [...acc, ...neighborhoodsRes.data.result.map(m => ({ ...m, cityId: district.cityId, districtId: district.id }))]
    }, Promise.resolve([])); 

    await fs.writeFileSync('./neighborhoods.json', JSON.stringify(neighborhoods))
    await fs.writeFileSync('./districts.json', JSON.stringify(districts))
    await fs.writeFileSync('./cities.json', JSON.stringify(cities))
    return Promise.resolve([])
}


app.get('/', (req, res) => {
    States().then(response => {
        console.log("Başarılı")
        res.json({ message: "işlem tamamlandı" })
    }).catch(error =>
        console.log('error', error)
    )
})




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})