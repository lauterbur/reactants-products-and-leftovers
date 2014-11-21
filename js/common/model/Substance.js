// Copyright 2002-2014, University of Colorado Boulder

/**
 * A substance is a participant in a chemical reaction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {number} coefficient substance's coefficient in the reaction equation
   * @param {string} symbol used in reaction equation
   * @param {SCENERY.Node} icon visual representation of the substance
   * @param {number} [quantity] how much of a substance we have, defaults to zero
   * @constructor
   */
  function Substance( coefficient, symbol, icon, quantity ) {

    quantity = quantity || 0;

    assert && assert( coefficient >= 0 );
    assert && assert( quantity >= 0 );

    this.symbol = symbol; // {String}

    PropertySet.call( this, {
      coefficient: coefficient, // {number} substance's coefficient in the reaction equation
      icon: icon, // {Node} visual representation of the substance, mutable to support the 'custom sandwich' case
      quantity: quantity  // {number} how much of the substance we have
    } );
  }

  return inherit( PropertySet, Substance, {

    /*
     * Are 2 substances the same? AXON.Property observers are not considered.
     * @param {Substance} substance
     * @return {boolean}
     */
    equals: function( substance ) {
      return ( substance instanceof Substance &&
               this.symbol === substance.symbol &&
               this.coefficient === substance.coefficient &&
               this.icon === substance.icon &&
               this.quantity === substance.quantity );
    }
  } );
} );
