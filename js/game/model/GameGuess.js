// Copyright 2002-2014, University of Colorado Boulder

/**
 * A 'guess' is the user's answer to a game challenge, and it may or may not be correct.
 * We call it a 'guess' to distinguish the user's answer from the correct answer.
 * (And yes, 'guess' is semantically incorrect, since a guess is uninformed. Live with it :-)
 * <p>
 * A guess is constructed based on a reaction and challenge type.
 * The guess will have the same number of reactants and products as the reaction,
 * and they are guaranteed to be in the same order.
 * Depending on the challenge type, values in the guess will be initialized to zero.
 * <p>
 * A guess is correct if the reaction and guess have the same quantities of reactants,
 * products and leftovers.
 * <p>
 * Run with the 'playAll' query parameter to fill in the correct answer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BoxType = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/BoxType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var Substance = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/Substance' );

  /**
   * @param {Reaction} reaction
   * @param {BoxType} interactiveBox which box is interactive
   * @constructor
   */
  function GameGuess( reaction, interactiveBox ) {

    assert && assert( interactiveBox === BoxType.BEFORE || interactiveBox === BoxType.AFTER );

    var thisNode = this;

    // Clone reactants, quantities are initialized to zero for 'Before' challenges.
    thisNode.reactants = [];
    reaction.reactants.forEach( function( reactant ) {
      thisNode.reactants.push( ( interactiveBox === BoxType.AFTER || RPALQueryParameters.PLAY_ALL ) ?
                               Substance.clone( reactant ) :
                               Substance.withQuantity( reactant, 0 ) );
    } );

    // Clone products, quantities are initialized to zero for 'After' challenges.
    thisNode.products = [];
    reaction.products.forEach( function( product ) {
      thisNode.products.push( ( interactiveBox === BoxType.BEFORE || RPALQueryParameters.PLAY_ALL ) ?
                              Substance.clone( product ) :
                              Substance.withQuantity( product, 0 ) );
    } );

    // Clone leftovers, quantities are initialized to zero for 'After' challenges.
    thisNode.leftovers = [];
    reaction.leftovers.forEach( function( leftover ) {
      thisNode.leftovers.push( ( interactiveBox === BoxType.BEFORE || RPALQueryParameters.PLAY_ALL ) ?
                               Substance.clone( leftover ) :
                               Substance.withQuantity( leftover, 0 ) );
    } );

    assert && assert( thisNode.reactants.length === reaction.reactants.length );
    assert && assert( thisNode.products.length === reaction.products.length );
    assert && assert( thisNode.leftovers.length === reaction.leftovers.length );
  }

  return inherit( Object, GameGuess, {

    reset: function() {
      this.reactants.forEach( function( reactant ) { reactant.reset(); } );
      this.products.forEach( function( product ) { product.reset(); } );
      this.leftovers.forEach( function( leftover ) { leftover.reset(); } );
    }
  } );
} );