import fetch from 'isomorphic-unfetch';

const getAddressMetadata = async (lat, lng, accessToken) => {
    try{
        let url = process.env.INVOICE_URL;
        url += "/api/address";
        url += `/lat/${encodeURIComponent(lat)}`;
        url += `/lng/${encodeURIComponent(lng)}`;
        const res = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `bearer ${accessToken}` }
        });
        if (res.status == 200){
            let json = await res.json();
            return json;
        }else{
            throw new Error("");
        }
    }catch(ex){
        return {
            administrative_area_level_1: 'Guatemala',
            administrative_area_level_2: 'Guatemala',
            neighborhood: '',
            street_address: '26 Avenida 4-81, Cdad. de Guatemala, Guatemala',
            sublocality: 'Zona 14',
            distance: {
                text: "0 km",
                value: 0.1
            }
        };
    }

};
export default {getAddressMetadata};