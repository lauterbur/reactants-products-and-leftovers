// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the 'Sandwiches' screen.
 * <p>
 * For the purposes of the 'sandwiches' analogy:
 * <ul>
 * <li>sandwich recipe == reaction
 * <li>ingredients == reactants
 * <li>sandwich == product
 * </ul>
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RPALBaseModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/model/RPALBaseModel' );
  var SandwichRecipe = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/sandwiches/model/SandwichRecipe' );

  // strings
  var cheeseString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/cheese' );
  var customString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/custom' );
  var meatAndCheeseString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/meatAndCheese' );

  function SandwichesModel() {
    RPALBaseModel.call( this,
      // sandwich recipe choices, numeric args are: bread, meat, cheese
      [
        new SandwichRecipe( cheeseString, 2, 0, 1 ),
        new SandwichRecipe( meatAndCheeseString, 2, 1, 1 ),
        // for Custom sandwich, the user can change coefficients of the ingredients
        new SandwichRecipe( customString, 0, 0, 0, { coefficientsMutable: true } )
      ] );
  }

  return inherit( RPALBaseModel, SandwichesModel );
} );
