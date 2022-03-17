import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useReactoForm } from "reacto-form";
import { uniqueId } from "lodash";
import { withComponents } from "@reactioncommerce/components-context";
import { CustomPropTypes, applyTheme, addTypographyStyles } from "@reactioncommerce/components/utils";
import { Field as Input, Form } from "react-final-form";
import { formatCVC, formatCreditCardNumber, formatExpirationDate, validateCreditCardNumber } from "../utils/index";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles(() => ({
	label_ : {
		marginTop:"10px"
	},
	labelColor: {
		color: "#1D0D13"
	},
	textInput: {
		width: "100%",
		border: "none",
		borderRadius: "5px",
		height: "40px",
		background: "#F4F1F1",
		padding: "10px",
		backgroundColor:"#F9F9F9",
		color: "#000",
		bordeRadius: "4px",		
	}
}));
import styled from "styled-components";
const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const SecureCaption = styled.div`
  ${addTypographyStyles("StripePaymentInputCaption", "captionText")}
`;
const IconLockSpan = styled.span`
  display: inline-block;
  height: 20px;
  width: 20px;
`;

const Span = styled.span`
  vertical-align: super;
`;
const ErrorSpan = styled.div`
  font-size: 12px;
  color: red;
`;
const CardSpan = styled.span`
  margin-left: 5px;
`;
const AcceptedPaymentMethods = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
`;
const ColFull = styled.div`
  flex: 1 1 100%;
`;

const ColHalf = styled.div`
  flex: 0 1 calc(50% - 2px);
  padding:2px;
  @media (min-width: ${applyTheme("sm", "breakpoints")}px) {
    flex: 0 1 calc(50% - 9px);
  }
`;
const renderIcons = (ccIcons) => (
	<div>
		{ccIcons.map((icon, index) => <CardSpan key={index}>{icon}</CardSpan>)}
	</div >
);
function EpayPaymentForm(props, ref) {
	const lastDocRef = useRef();
	const isReadyRef = useRef();
	const classes = useStyles();
	let _form = null;
	const [uniqueInstanceIdentifier, setUniqueInstanceIdentifier] = useState();
	if (!uniqueInstanceIdentifier) {
		setUniqueInstanceIdentifier(uniqueId("EpayPaymentForm"));
	}
	function buildResult({ cardNumber = null, cardExpiry = null, cardCVV = null, cardName = null }) {
		return {
			data: { cardNumber, cardExpiry, cardCVV, cardName },
			displayName: "Tarjeta de crédito"
		};
	}
	const {
		className,
		components: {
			Field,
			iconLock
		},
		isSaving,
		onChange,
		onReadyForSaveChange,
		onSubmit
	} = props;
	const {
		submitForm,

	} = useReactoForm({
		isReadOnly: isSaving,
		onChange(formData) {
			const resultDoc = buildResult(formData);
			const stringDoc = JSON.stringify(resultDoc);
			if (stringDoc !== lastDocRef.current) {
				onChange(resultDoc);
			}
			lastDocRef.current = stringDoc;

			const isReady = !!formData.cardNumber;
			if (isReady !== isReadyRef.current) {
				onReadyForSaveChange(isReady);
			}
			isReadyRef.current = isReady;
		},
		onSubmit: (formData) => onSubmit(buildResult(formData))
	});
	const handleChange = formData => {
		const resultDoc = buildResult(formData);
		const stringDoc = JSON.stringify(resultDoc);
		if (stringDoc !== lastDocRef.current) {
			onChange(resultDoc);
		}
		lastDocRef.current = stringDoc;

		const isReady = !!formData.cardNumber;
		if (isReady !== isReadyRef.current) {
			onReadyForSaveChange(isReady);
		}
		isReadyRef.current = isReady;
		onSubmit(resultDoc);
	};
	useImperativeHandle(ref, () => ({
		submit() {
			submitForm();
		}
	}));
	const validateForm = values => {
		const errors = {};
		if (!values.cardName) {
			errors.cardName = "Este campo es requerido";
		}
		if (!values.cardNumber) {
			errors.cardNumber = "Este campo es requerido";
		}
		if (!validateCreditCardNumber((values.cardNumber || "").replace(/ /g, ""))) {
			errors.cardNumber = "Ingrese un número de tarjeta válido";
		}
		if (!values.cardExpiry) errors.cardExpiry = "Este campo es requerido";
		if (!values.cardCVV) errors.cardCVV = "Este campo es requerido";
		return errors;
	};
	const cardNameInputId = `cardName_${uniqueInstanceIdentifier}`;
	const cardNumberInputId = `cardNumber_${uniqueInstanceIdentifier}`;
	const cardExpiryInputId = `cardExpiry_${uniqueInstanceIdentifier}`;
	const cardCVVInputId = `cardCVV_${uniqueInstanceIdentifier}`;
	const ccIcons = [
		props.components.iconVisa,
		props.components.iconMastercard
	];
	return (
		<div className={classes.label_}>
			<AcceptedPaymentMethods>
				{renderIcons(ccIcons)}
			</AcceptedPaymentMethods>
			<Form
				onSubmit={submitForm}
				ref={(formEl) => _form = formEl}
				validate={validateForm}
				render={({
					handleSubmit,
					values,
					errors
				}) => {
					handleChange(values);
					return (
						<div onSubmit={handleSubmit}>
							<form className={className}>
								<Grid>
									<ColFull>
										<Field name="cardName" labelFor={cardNameInputId}>
											<label className={classes.labelColor}>Nombre Completo</label>
											<div className={classes.label_}></div>
											<Input
												className={classes.textInput}
												name="cardName"
												component="input"
												type="text"
												id={cardNameInputId}
												placeholder="Nombre completo"
											/>
											{errors.cardName && values.cardName && <ErrorSpan>{errors.cardName}</ErrorSpan>}
										</Field>
									</ColFull>
									<ColFull>
										<Field name="cardNumber"  labelFor={cardNumberInputId}>
										<label className={classes.labelColor}>Número de Tarjeta</label>
										<div className={classes.label_}></div>
											<Input
												className={classes.textInput}
												name="cardNumber"
												component="input"
												type="text"
												id={cardNumberInputId}
												pattern="[\d| ]{16,16}"
												placeholder="Número de tarjeta"
												format={formatCreditCardNumber}
											/>
											{errors.cardNumber && values.cardNumber && <ErrorSpan>{errors.cardNumber}</ErrorSpan>}
										</Field>
									</ColFull>
									<ColHalf>
										<Field name="cardExpiry"  labelFor={cardExpiryInputId}>
										<label className={classes.labelColor}>Fecha de Vencimiento</label>
										<div className={classes.label_}></div>
											<Input
												className={classes.textInput}
												name="cardExpiry"
												id={cardExpiryInputId}
												component="input"
												type="text"
												pattern="\d\d/\d\d"
												placeholder="Fecha de vencimiento"
												format={formatExpirationDate}
											/>
										</Field>
									</ColHalf>
									<ColHalf>
										<Field name={"cardCVV"}  labelFor={cardCVVInputId}>
										<label className={classes.labelColor}>Código de seguridad</label>
										<div className={classes.label_}></div>
											<Input
												className={classes.textInput}
												name="cardCVV"
												component="input"
												type="text"
												id={cardCVVInputId}
												pattern="\d{3,4}"
												placeholder="CVV/CVC"
												format={formatCVC}
											/>
										</Field>
									</ColHalf>
								</Grid>
							</form>
						</div>
					);
				}}
			/>
			<SecureCaption>
				<IconLockSpan>{iconLock}</IconLockSpan> <Span>{"Su información es privada y segura"}</Span>
			</SecureCaption> 
		</div>
	);
}
EpayPaymentForm = withComponents(forwardRef(EpayPaymentForm));
EpayPaymentForm.propTypes = {
	/**
	 * You can provide a `className` prop that will be applied to the outermost DOM element
	 * rendered by this component. We do not recommend using this for styling purposes, but
	 * it can be useful as a selector in some situations.
	 */
	className: PropTypes.string,
	/**
	 * If you've set up a components context using
	 * [@reactioncommerce/components-context](https://github.com/reactioncommerce/components-context)
	 * (recommended), then this prop will come from there automatically. If you have not
	 * set up a components context or you want to override one of the components in a
	 * single spot, you can pass in the components prop directly.
	 */
	components: PropTypes.shape({
		/**
	   * Pass either the Reaction ErrorsBlock component or your own component that
	   * accepts compatible props.
	   */
		ErrorsBlock: CustomPropTypes.component.isRequired,
		/**
	   * Pass either the Reaction Input component or your own component that
	   * accepts compatible props.
	   */
		Input: CustomPropTypes.component.isRequired,
		/**
	   * Pass either the Reaction TextInput component or your own component that
	   * accepts compatible props.
	   */
		TextInput: CustomPropTypes.component.isRequired
	}),
	/**
	 * Pass true while the input data is in the process of being saved.
	 * While true, the form Inputs are disabled.
	 */
	isSaving: PropTypes.bool,
	/**
	 * Called as the form Inputs are changed
	 */
	onChange: PropTypes.func,
	/**
	 * When this action's input data switches between being
	 * ready for saving and not ready for saving, this will
	 * be called with `true` (ready) or `false`
	 */
	onReadyForSaveChange: PropTypes.func,
	/**
	 * Called with an object value when this component's `submit`
	 * method is called. The object may have `data`, `displayName`,
	 * and `amount` properties.
	 */
	onSubmit: PropTypes.func,	
};

EpayPaymentForm.defaultProps = {
	isSaving: false,
	onChange() { },
	onReadyForSaveChange() { },
	onSubmit() { }
};
export default EpayPaymentForm;