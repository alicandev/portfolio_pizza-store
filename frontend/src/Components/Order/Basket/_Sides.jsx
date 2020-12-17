import React from 'react';
import PropTypes from 'prop-types';
import { arrayEmpty } from './utils';

const Sides = ({ sides }) => {
  const sidesTotal = () => sides && (
    sides.reduce((a, b) => b && a + (b.price * b.quantity), 0).toFixed(2)
  );
  return (
    !arrayEmpty(sides) && (
      <div className="Sides col-xl-12">
        <h4>
          Sides (£
          {sidesTotal()}
          )
        </h4>
        {sides.map((s) => (
          <p className="Side">
            {s.quantity}
            {' x '}
            {s.name}
            {' (£'}
            {s.price}
            )
          </p>
        ))}
      </div>
    )
  );
};

Sides.propTypes = {
  sides: PropTypes.arrayOf({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default Sides;
