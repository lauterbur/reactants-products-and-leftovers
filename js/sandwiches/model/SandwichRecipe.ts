// Copyright 2014-2023, University of Colorado Boulder

/**
 * Recipe for a sandwich.
 *
 * For the purposes of the 'sandwiches' analogy:
 * - sandwich recipe == reaction
 * - ingredients == reactants
 * - sandwich == product
 *
 * A 'custom' sandwich has mutable reactant coefficients, and the sandwich image changes based on those coefficients.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import Reaction, { ReactionOptions } from '../../common/model/Reaction.js';
import Substance from '../../common/model/Substance.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import SandwichNode from '../view/SandwichNode.js';

// Used when the product is undefined. This can be any non-visible node with well-defined bounds.
const NO_SANDWICH_NODE = new Rectangle( 0, 0, 5, 5 );

type SelfOptions = {
  coefficientsMutable?: boolean; // Can coefficients of the ingredients can be changed?
};

type SandwichRecipeOptions = SelfOptions;

export default class SandwichRecipe extends Reaction {

  public readonly sandwich: Substance;
  public readonly coefficientsMutable: boolean;

  public constructor( nameProperty: TReadOnlyProperty<string>,
                      breadCount: number, meatCount: number, cheeseCount: number,
                      providedOptions?: SandwichRecipeOptions ) {

    assert && assert( Number.isInteger( breadCount ) && Number.isInteger( meatCount ) && Number.isInteger( cheeseCount ) );
    assert && assert( breadCount >= 0 && meatCount >= 0 && cheeseCount >= 0 );

    const options = optionize<SandwichRecipeOptions, SelfOptions, ReactionOptions>()( {

      // SelfOptions
      coefficientsMutable: false
    }, providedOptions );

    // Reactants: sandwich ingredients (symbols are internal for sandwiches, no i18n required)
    const bread = new Substance( breadCount, 'bread', SandwichNode.createBreadIcon() );
    const meat = new Substance( meatCount, 'meat', SandwichNode.createMeatIcon() );
    const cheese = new Substance( cheeseCount, 'cheese', SandwichNode.createCheeseIcon() );

    // Products: sandwich
    const sandwich = new Substance( 1, 'sandwich', new SandwichNode( breadCount, meatCount, cheeseCount ) );

    super( [ bread, meat, cheese ], [ sandwich ], { nameProperty: nameProperty } );

    // Updates the sandwich (product) icon
    Multilink.multilink(
      [ bread.coefficientProperty, meat.coefficientProperty, cheese.coefficientProperty ],
      ( breadCoefficient, meatCoefficient, cheeseCoefficient ) => {
        sandwich.iconProperty.value = this.isReaction() ?
                                      new SandwichNode( breadCoefficient, meatCoefficient, cheeseCoefficient ) :
                                      NO_SANDWICH_NODE;
      } );

    this.sandwich = sandwich;
    this.coefficientsMutable = options.coefficientsMutable;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'SandwichRecipe', SandwichRecipe );