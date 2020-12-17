/* eslint-disable no-nested-ternary */
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { OrderContext } from './Context/OrderStore';
import { orderTotal, arrayEmpty } from './utils';

import ReviewPizzas from './_ReviewPizzas';
import ReviewSidesAndDrinks from './_ReviewSidesAndDrinks';
import ReviewSides from './_ReviewSides';
import ReviewDrinks from './_ReviewDrinks';

const ReviewOrder = () => {
  const [{ pizzas, sides, drinks }, dispatch] = useContext(OrderContext);

  const removePizza = (pizza) => {
    dispatch({
      type: 'REMOVE_PIZZA',
      payload: pizza,
    });
  };

  const removeSide = (side) => (
    side.quantity === 1 ? (
      dispatch({
        type: 'REMOVE_SIDE',
        payload: side.name,
      })
    ) : (
      dispatch({
        type: 'DECREASE_SIDE_QUANTITY',
        payload: side.name,
      })
    )
  );

  const removeDrink = (drink) => (
    (drink.quantity === 1 ? (
      dispatch({
        type: 'REMOVE_DRINK',
        payload: drink.name,
      })
    ) : (
      dispatch({
        type: 'DECREASE_DRINK_QUANTITY',
        payload: drink.name,
      })
    ))
  );

  return (
    <section id="ReviewOrder">
      <div id="PageContainer" className="container-fluid">
        <div id="PageRow" className="row">

          <article className="PageHead col-10 offset-1">
            <Link to="/order" className="BackButton">BACK</Link>
            <h2 className="Header">YOUR ORDER</h2>
          </article>

          {!arrayEmpty(pizzas) && <ReviewPizzas pizzas={pizzas} removePizza={removePizza} />}

          {(!arrayEmpty(sides) && !arrayEmpty(drinks)) ? (
            <ReviewSidesAndDrinks
              sides={sides}
              drinks={drinks}
              removeSide={removeSide}
              removeDrink={removeDrink}
            />
          ) : (
            !arrayEmpty(sides) ? <ReviewSides sides={sides} removeSide={removeSide} /> : (
              !arrayEmpty(drinks) && <ReviewDrinks drinks={drinks} removeSide={removeSide} />
            )
          )}

          <article className="Done col-10 offset-1">
            <h4 className="Total">
              Total: £
              {orderTotal(pizzas, sides, drinks)}
            </h4>
            <Link to="/order/finalize" className="Confirm">CONFIRM</Link>
          </article>

        </div>
      </div>
    </section>
  );
};

export default ReviewOrder;
