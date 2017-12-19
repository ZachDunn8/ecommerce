// An action is JavaScript function that returns
// an object. That object MUST have at least a property of "type"
import axios from 'axios';

export default function(formData){
	console.log('auth action is running')
	console.log(formData);
	var axiosPromise = axios({
		url: `${window.apiHost}/register`,
		method: "POST",
		data: formData
	})
	console.log(axiosPromise);
	// our redux-promise middleware will kick in 
	// because the payload value is a redux-promise
	// redux-promise will hold up the dispatch
	// until it resolves
	return{
		type: "AUTH_ACTION",
		payload: axiosPromise
	}
}