import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GetCart from '../actions/GetCart';
import CartRow from '../components/CartRow';
import axios from 'axios';

class Cart extends Component{
	constructor(){
		super();
		this.makePayment = this.makePayment.bind(this);
	}

	makePayment() {
		var handler = window.StripeCheckout.configure({
			key: 'pk_test_DIAAMPWx8gGUHUKUGtmddP5l',
			locale: 'auto',
			token: (token) => {
				var theData = {
					amount: this.props.cart.totalPrice * 100,
					stripeToken: token.id,
					userToken: this.props.auth.token,
				}
				axios({
					method: 'POST',
					url: `${window.apiHost}/stripe`,
					data: theData
				}).then((response) => {
					console.log(response);
					if (response.data.msg === 'paymentSuccess') {
						this.props.history.push('/thankyou')
					}else{
						console.log(response.data.msg)
					}
				});
			}
		});
		handler.open({
			name: "Pay Now",
			description: 'Pay Now',
			amount: this.props.cart.totalPrice * 100 //the total is in pennies
		})
	}

	componentDidMount(){
		console.log(this.props.auth);
		if(this.props.auth.token === undefined){
			// if the user has no token... they should not be here. Goodbye.
			// this.props.history.push('/login')
		}else{
			// the user does have a token, go get their cart!
			this.props.getCart(this.props.auth.token);
		}
	}

	render(){
		console.log(this.props.cart);
		if(this.props.cart.totalItems === 0){
			return(
				<div>
					<h3>Your cart is empty! Get shopping!</h3>
				</div>
			)
		}else{
			var cartArray = this.props.cart.products.map((product, index)=>{
				console.log(product)
				return (
					<CartRow ley={index} product={product} />
				)
			})
			return(
				<div>
					<h2>Your ordal total is: ${this.props.cart.totalPrice} - <button className='btn btn-success'onClick={this.makePayment()}>Checkout!</button></h2>
					<table className='table table-striped'>
						<thead>
							<tr>
								<th>Product</th>
								<th>Price</th>
								<th>Remove</th>
							</tr>
						</thead>
						<tbody>
							{cartArray}
						</tbody>
					</table>
				</div>
			)
		}
	}
}

function mapStateToProps(state){
	return{
		auth: state.auth,
		cart: state.cart
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		getCart: GetCart
	},dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(Cart);
