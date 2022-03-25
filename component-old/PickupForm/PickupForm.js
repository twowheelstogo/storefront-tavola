import React, { Component, Fragment } from "react";
import { Form } from "reacto-form";
import { withComponents } from "@reactioncommerce/components-context";
import { CustomPropTypes, applyTheme, getRequiredValidator } from "@reactioncommerce/components/utils";
import PropTypes from "prop-types";
import styled from "styled-components";
import { uniqueId } from "lodash";
const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ColFull = styled.div`
  flex: 1 1 100%;
`;

const ColHalf = styled.div`
  flex: 1 1 100%;
  @media (min-width: ${applyTheme("sm", "breakpoints")}px) {
    flex: 0 1 calc(50% - 9px);
  }
`;

function join(t, a, s) {
	function format(m) {
		let f = new Intl.DateTimeFormat('en', m);
		const isMinor = Boolean(Number(f.format(t)) < 10);
		return isMinor ? `0${f.format(t)}` : f.format(t);
	}
	return a.map(format).join(s);
}

class PickupForm extends Component {
	static propTypes = {
		components: PropTypes.shape({
			Field: CustomPropTypes.component.isRequired,
			TextInput: CustomPropTypes.component.isRequired
		})
	}

	_form = null;

	uniqueInstanceIdentifier = uniqueId("AddressForm_");
	submit = () => {
		this._form.submit();
	}
	static defaultProps = {
		name: "pickup",
		onChange: () => { },
		onSubmit: () => { },
		value: {
			pickupDate: "",
			pickupTime: ""
		},
		validator: getRequiredValidator("pickupDate", "pickupTime")
	}
	render() {
		const {
			components: {
				Field,
				TextInput,
				ErrorsBlock
			},
			value,
			onChange,
			onSubmit,
			name,
			validator
		} = this.props;
		const pickupDateInputId = `pickupDate_${this.uniqueInstanceIdentifier}`;
		const pickupTimeInputId = `pickupTime_${this.uniqueInstanceIdentifier}`;
		const options = [{ year: 'numeric' }, { month: 'numeric' }, { day: 'numeric' }];
		const today = new Date();
		const minDate = join(today, options, "-");
		const maxDate = join(new Date(today.setHours(24)), options, "-");

		const minTime = today;
		minTime.setHours(-1);
		minTime.setMinutes(today.getMinutes() + 20);
		const formatMinTime = minTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", });

		return (
			<Form
				ref={(formEl) => {
					this._form = formEl;
				}}
				onChange={onChange}
				onSubmit={onSubmit}
				name={name}
				value={value}
				revalidateOn="changed"
				validator={validator}
			>
				<Grid>
					<ColHalf>
						<Field name="pickupDate" label="Fecha de pickup" labelFor={pickupDateInputId} isRequired>
							<TextInput
								id={pickupDateInputId}
								name="pickupDate"
								placeholder={"Fecha"}
								type={"date"}
								min={minDate}
								max={maxDate}
							/>
							<ErrorsBlock names={["pickupDate"]} />
						</Field>
					</ColHalf>
					<ColHalf>
						<Field name="pickupTime" label="Hora de pickup" labelFor={pickupTimeInputId} isRequired>
							<TextInput
								id={pickupTimeInputId}
								name="pickupTime"
								placeholder={"Hora"}
								type="time"
								min={"12:00"}
								step="600"
							/>
							<ErrorsBlock names={["pickupTime"]} />
						</Field>
					</ColHalf>
				</Grid>
			</Form>
		);
	}
}
export default withComponents(PickupForm);