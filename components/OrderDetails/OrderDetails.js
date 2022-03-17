import React, { Fragment } from "react";
import styled from "styled-components";


const ContainerCustomer = styled.div`
padding-left: 16px;
padding-bottom: 20px;
`;

const DescriptionData = styled.div`
font-size: 16px; 
padding-top: 5px;
font-weight: 500;
`;

const TitlesCustomer = styled.div`
font-size: 20px; 
padding-top: 10px;
font-weight: 800;
`;

const OrderDetails = (props) => {

    const order = props.order;

    const obj = [
        { "title": "Cliente", "label": "Josue" },
        { "title": "Dirección de entrega", "label": order.payments[0].billingAddress.address },
        { "title": "Teléfono", "label": "32068534" },
        { "title": "Correo", "label": order.email },
        { "title": "Dirección de facturación", "label": order.email },
        { "title": "Nit", "label": order.email },
        { "title": "Método de pago", "label": order.payments[0].method.name === "epay_card" ? "Tarjeta" : "Efectivo"}
    ]

    console.log(obj)

    console.log(order)
    return (
        <Fragment>
            <ContainerCustomer>
                {
                    obj.map((inputs) => (
                        <div>
                            <TitlesCustomer>{inputs.title}</TitlesCustomer>
                            <DescriptionData> {inputs.label} </DescriptionData>
                        </div>
                    ))
                }

            </ContainerCustomer>
        </Fragment>
    )
}

export default OrderDetails; 