import React, { Component, Fragment } from "react";
import { withComponents } from "@reactioncommerce/components-context";
import styled from "styled-components";
import { Form } from "reacto-form";
import uniqueId from "lodash.uniqueid";
import { getRequiredValidator, applyTheme } from "@reactioncommerce/components/utils";
const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const ColFull = styled.div`
  flex: 1 1 100%;
`;
const FieldTitle = styled.div`
    font-size: 14px;
    color: #1D0D13;
    font-weight: 700;
    @media (min-width: ${applyTheme("sm", "breakpoints")}px) {
        font-size: 18px;
      }
`;
class AddressForm extends Component {
    uniqueInstanceIdentifier = uniqueId("AddressForm_");
    _form = null;
    static defaultProps = {
        onSubmit: () => { },
        onChange: () => { },
        value: {
            address: "",
            description: "",
            reference: "",
            phone: "",
            receiver: ""
        },
        validator: getRequiredValidator("address", "description","phone","receiver")
    }
    submit = () => {
        this._form.submit();
    }
    getValue = () => this._form.getValue();
    render() {
        const {
            components: {
                Field,
                TextInput,
                ErrorsBlock
            },
            onSubmit,
            value,
            onChange,
            validator
        } = this.props;
        console.log(this.props)
        const addressInputId = `addressInput_${this.uniqueInstanceIdentifier}`;
        const referenceInputId = `referenceInput_${this.uniqueInstanceIdentifier}`;
        const descriptionInputId = `descriptionInput_${this.uniqueInstanceIdentifier}`;
        const receptorInputId = `receptorInputId${this.uniqueInstanceIdentifier}`;
        const telefonoInputId = `telefonoInputId${this.uniqueInstanceIdentifier}`;
        return (
            <Fragment>
                <Form
                    ref={(formEl) => this._form = formEl}
                    onSubmit={onSubmit}
                    value={value}
                    revalidateOn="changed"
                    onChange={onChange}
                    validator={validator}
                >
                    <Grid>
                        <ColFull>
                            <FieldTitle>{"Dirección Completa"}</FieldTitle>
                            <Field name="address" label="Obligatorio" labelFor={addressInputId} isRequired>
                                <TextInput
                                    id={addressInputId}
                                    name="address"
                                    placeholder="ej. 5av 5-55 Edificio Europlaza, Guatemala ciudad"
                                />
                                <ErrorsBlock names={["address"]} />
                            </Field>
                        </ColFull>
                        <ColFull>
                            <FieldTitle>{"Detalles de la address"}</FieldTitle>
                            <Field name="reference" labelFor={referenceInputId} isOptional>
                                <TextInput
                                    id={referenceInputId}
                                    name="reference"
                                    placeholder="No de casa, apto, nivel, referencia sobre como llegar, etc."
                                />
                            </Field>
                        </ColFull>
                        <ColFull>
                            <FieldTitle>{"Descripción"}</FieldTitle>
                            <Field name="description" label="Obligatorio" labelFor={descriptionInputId} isRequired>
                                <TextInput
                                    id={descriptionInputId}
                                    name="description"
                                    placeholder="ej. Casa, Trabajo."
                                />
                                <ErrorsBlock names={["description"]} />
                            </Field>
                        </ColFull>
                        <ColFull>
                            <FieldTitle>{"¿Quién recibe?"}</FieldTitle>
                            <Field name="receiver" label="Obligatorio" labelFor={receptorInputId} isRequired>
                                <TextInput
                                    id={receptorInputId}
                                    name="receiver"
                                    placeholder="Escribe aqui..."
                                    
                                />
                                <ErrorsBlock names={["receiver"]} />
                            </Field>
                        </ColFull>
                        <ColFull>
                            <FieldTitle>{"Teléfono de quién recibe"}</FieldTitle>
                            <Field name="phone" label="Obligatorio" labelFor={telefonoInputId} isRequired>
                                <TextInput
                                    id={telefonoInputId}
                                    name="phone"
                                    placeholder="Numero de Telefono e.g: 55555555"
                                    type="number"
                                />
                                <ErrorsBlock names={["phone"]} />
                            </Field>
                        </ColFull>
                    </Grid>
                </Form>
            </Fragment>
        );
    }
}
export default withComponents(AddressForm);