import fetch from 'isomorphic-unfetch';
const invoiceUrl = process.env.INVOICE_URL;

const getNit = async (nit, accessToken) => {
    try{
        const res = await fetch(`${invoiceUrl}/api/nit/${nit}`, {
            method: "GET",
            headers: { "Authorization": `bearer ${accessToken}` }
        });
        if (res.status == 200){
            let json = await res.json();
            return {...json, hasData:true}
        }else{
            return {
                vat: '0',
                name: '',
                street: '',
                partnerId: -1,
                hasData:false
            };
        }
    }catch(ex){
        return {
            vat: '0',
            name: '',
            street: '',
            partnerId: -1,
            hasData:false
        };
    }

};
export default {getNit};