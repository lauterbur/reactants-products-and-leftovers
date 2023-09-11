// Copyright 2014-2023, University of Colorado Boulder

/**
 * Model for the 'Molecules' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import ReactionFactory from '../../common/model/ReactionFactory.js';
import RPALBaseModel from '../../common/model/RPALBaseModel.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

export default class MoleculesModel extends RPALBaseModel {

  public constructor( tandem: Tandem ) {

    const reactionsTandem = tandem.createTandem( 'reactions' );

    const reactions = [
      ReactionFactory.combustMethane( reactionsTandem.createTandem( 'combustMethane' ) ),
      ReactionFactory.Reaction_steponeIbu( reactionsTandem.createTandem( 'Reaction_steponeIbu' ) ),
      ReactionFactory.R_stepthreeIbu( reactionsTandem.createTandem( 'Reaction_test' ) )
    ];

    super( reactions, tandem );
  }
}

reactantsProductsAndLeftovers.register( 'MoleculesModel', MoleculesModel );
