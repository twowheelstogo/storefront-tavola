import React from "react";
import questions from "lib/utils/questions.json";
import hoistNonReactStatic from "hoist-non-react-statics";
function withQuestions(Component){
	const WithQuestions=props=>{
		return <Component{...props} questions={questions}/>;
	};
	return hoistNonReactStatic(WithQuestions,Component);
}
export default withQuestions;