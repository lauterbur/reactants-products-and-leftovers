// Copyright 2014-2023, University of Colorado Boulder

/**
 * SandwichesScreenView is the view for the 'Sandwiches' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RPALConstants from '../../common/RPALConstants.js';
import BeforeAfterNode, { BeforeAfterNodeOptions } from '../../common/view/BeforeAfterNode.js';
import RPALScreenView, { CreateBeforeAfterNodeFunction } from '../../common/view/RPALScreenView.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import SandwichesModel from '../model/SandwichesModel.js';
import SandwichesEquationNode from './SandwichesEquationNode.js';
import SandwichNode from './SandwichNode.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { CreateEquationNodeFunction } from '../../common/view/ReactionBarNode.js';

export default class SandwichesScreenView extends RPALScreenView {

  public constructor( model: SandwichesModel, tandem: Tandem ) {

    // compute the size of the largest sandwich, used for view layout
    const maxCoefficient = RPALConstants.SANDWICH_COEFFICIENT_RANGE.max;
    const maxSandwich = new SandwichNode( maxCoefficient, maxCoefficient, maxCoefficient );
    const maxSandwichSize = new Dimension2( maxSandwich.width, maxSandwich.height );

    // Creates an equation for a specified reaction.
    //TODO https://github.com/phetsims/reactants-products-and-leftovers/issues/80 TS2345: Argument of type 'Reaction' is not assignable to parameter of type 'SandwichRecipe'.
    // @ts-expect-error
    const createEquationNode: CreateEquationNodeFunction = reaction => new SandwichesEquationNode( reaction, maxSandwichSize );

    // Creates the Before/After interface for a specified reaction.
    const createBeforeAfterNode: CreateBeforeAfterNodeFunction =
      ( reaction, beforeExpandedProperty, afterExpandedProperty, options ) =>
        new BeforeAfterNode( reaction, beforeExpandedProperty, afterExpandedProperty,
          combineOptions<BeforeAfterNodeOptions>( {
            contentSize: RPALConstants.SANDWICHES_BEFORE_AFTER_BOX_SIZE,
            showSymbols: false,
            beforeTitleProperty: ReactantsProductsAndLeftoversStrings.beforeSandwichStringProperty,
            afterTitleProperty: ReactantsProductsAndLeftoversStrings.afterSandwichStringProperty,
            minIconSize: maxSandwichSize,
            boxYMargin: 8 // large enough to accommodate the biggest sandwich
          }, options ) );

    super( model, createEquationNode, createBeforeAfterNode, tandem );
  }
}

reactantsProductsAndLeftovers.register( 'SandwichesScreenView', SandwichesScreenView );