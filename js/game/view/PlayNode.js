// Copyright 2002-2014, University of Colorado Boulder

/**
 * Portion of the scenegraph that corresponds to GamePhase.PLAY.
 * Displays the scoreboard and current challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ChallengeNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/view/ChallengeNode' );
  var DevGameControls = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/dev/DevGameControls' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var RPALQueryParameters = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALQueryParameters' );
  var ScoreboardBar = require( 'VEGAS/ScoreboardBar' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var SCOREBOARD_X_MARGIN = 50;

  /**
   * @param {GameModel} model
   * @param {Bounds2} layoutBounds the {Screen}'s layoutBounds
   * @param {GameAudioPlayer} audioPlayer
   * @constructor
   */
  function PlayNode( model, layoutBounds, audioPlayer ) {

    var thisNode = this;
    Node.call( thisNode );

    // scoreboard, across the top of the screen
    var scoreboardNode = new ScoreboardBar(
      layoutBounds.width,
      model.challengeIndexProperty,
      model.numberOfChallengesProperty,
      model.levelProperty,
      model.scoreProperty,
      model.timer.elapsedTimeProperty,
      model.timerEnabledProperty,
      // callback for the 'New Game' button
      function() {
        model.settings();
      },
      // ScoreboardBar options
      {
        font: new RPALFont( 16 ),
        leftMargin: SCOREBOARD_X_MARGIN,
        rightMargin: SCOREBOARD_X_MARGIN,
        centerX: layoutBounds.centerX,
        top: 0
      } );
    thisNode.addChild( scoreboardNode );

    // challenge will be displayed in the area below the scoreboard
    var challengeBounds = new Bounds2( layoutBounds.left, scoreboardNode.bottom, layoutBounds.right, layoutBounds.bottom );

    // Displays the time required to switch between challenges
    var timeText = new Text( '?', {
      font: new RPALFont( 12 ),
      fill: 'red',
      bottom: layoutBounds.bottom - 25
    } );
    if ( RPALQueryParameters.DEV ) {
      thisNode.addChild( timeText );
    }

    // for deferring removal of previous ChallengeNode, to improve responsiveness
    this.oldChallengeNode = null;

    /*
     * Displays the current challenge.
     * Unlink unnecessary because this node exists for the lifetime of the simulation.
     */
    var challengeNode = null;
    model.challengeProperty.link( function( challenge ) {

      var beforeTime = Date.now();

      // clean up previous challenge
      if ( challengeNode ) {
        thisNode.oldChallengeNode = challengeNode;  // defer removeChild to step()
        challengeNode.visible = false;
        challengeNode = null;
      }

      // set up new challenge
      if ( challenge ) { // challenge will be null on startup and 'Reset All'
        challengeNode = new ChallengeNode( model, challengeBounds, audioPlayer );
        thisNode.addChild( challengeNode );
      }

      // display the time required to switch challenges
      timeText.text = ( Date.now() - beforeTime ) + ' ms';
      timeText.centerX = layoutBounds.centerX;
    } );

    // Developer controls at top-right, below scoreboard
    if ( RPALQueryParameters.DEV ) {
      thisNode.addChild( new DevGameControls( model, {
        right: layoutBounds.right - 5,
        top: scoreboardNode.bottom + 5
      } ) );
    }
  }

  return inherit( Node, PlayNode, {

    /**
     * See issue #17
     * To defer the cost of removing a ChallengeNode from the scene,
     * schedule it to be removed on the tick *after* the tick that the new
     * ChallengeNode was added on. This ensures that the previous ChallengeNode is
     * removed after Scene.updateScene (when the new ChallengeNode is made visible).
     */
    stepsSinceRemoveChild: 0,
    step: function( elapsedTime ) {
      if ( this.oldChallengeNode ) {
        this.stepsSinceRemoveChild++;
        if ( this.stepsSinceRemoveChild === 2 ) {
          this.removeChild( this.oldChallengeNode );
          this.oldChallengeNode.dispose();
          this.oldChallengeNode = null;
          this.stepsSinceRemoveChild = 0;
        }
      }
    }
  } );
} );