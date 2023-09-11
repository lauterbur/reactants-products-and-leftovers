Reactants, Products and Leftovers
=============
"Reactants, Products and Leftovers" is an educational simulation in HTML5,
by <a href="https://phet.colorado.edu/" target="_blank">PhET Interactive Simulations</a>
at the University of Colorado Boulder.
For a description of this simulation, associated resources, and a link to the published version,
<a href="https://phet.colorado.edu/en/simulation/reactants-products-and-leftovers" target="_blank">visit the
simulation's web page</a>.

### Quick Start

(1) Clone the simulation and its dependencies:

```
git clone https://github.com/phetsims/assert.git
git clone https://github.com/phetsims/axon.git
git clone https://github.com/phetsims/babel.git
git clone https://github.com/phetsims/brand.git
git clone https://github.com/phetsims/chipper.git
git clone https://github.com/phetsims/dot.git
git clone https://github.com/phetsims/joist.git
git clone https://github.com/phetsims/kite.git
git clone https://github.com/lauterbur/nitroglycerin.git
git clone https://github.com/phetsims/perennial.git perennial-alias
git clone https://github.com/phetsims/phet-core.git
git clone https://github.com/phetsims/phetcommon.git
git clone https://github.com/phetsims/phetmarks.git
git clone https://github.com/phetsims/query-string-machine.git
git clone https://github.com/lauterbur/reactants-products-and-leftovers.git
git clone https://github.com/phetsims/scenery.git
git clone https://github.com/phetsims/scenery-phet.git
git clone https://github.com/phetsims/sherpa.git
git clone https://github.com/phetsims/sun.git
git clone https://github.com/phetsims/tambo.git
git clone https://github.com/phetsims/tandem.git
git clone https://github.com/phetsims/twixt.git
git clone https://github.com/phetsims/utterance-queue.git
git clone https://github.com/phetsims/vegas.git
```

(2) Install dev dependencies:

```
cd chipper
npm install
cd ../perennial-alias
npm install
cd ../reactants-products-and-leftovers
npm install
```

(3) Change directory to chipper `cd ../chipper/`, then transpile the code to JavaScript by
running `node js/scripts/transpile.js --watch`. This starts a file-watching process
that will automatically transpile new or changed files.

(4) In a new terminal/command prompt, start an http-server

(5) Open in the browser: `http://localhost/reactants-products-and-leftovers/reactants-products-and-leftovers_en.html` (
You will probably need to modify this URL based on your HTTP port and relative path.)

#### Optional: Build the simulation into a single file

(1) Change directory to the simulation directory: `cd ../reactants-products-and-leftovers`

(2) Build the sim: `grunt --brands=adapted-from-phet`. It is safe to ignore warnings
like `>> WARNING404: Skipping potentially non-public dependency`,
which indicate that non-public PhET-iO code is not being included in the build.

(3) Open in the
browser: `http://0.0.0.0:8080/reactants-products-and-leftovers/reactants-products-and-leftovers_en.html` (
You may need to modify this URL based on your HTTP port (8080 in this example) and relative path.)

### License

See the <a href="https://github.com/phetsims/reactants-products-and-leftovers/blob/main/LICENSE" target="_blank">
LICENSE</a>
