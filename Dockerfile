FROM node:latest
LABEL maintainer="M. Elise Lauterbur <lauterbur@gmail.com> for AAUW"


ENV APP_HOME /app
RUN mkdir -pv $APP_HOME
WORKDIR $APP_HOME
ADD . $APP_HOME
ENV NODE_ENV production
ENV NPM_CONFIG_LOGLEVEL warn
# ADD CUSTOM REGISTRY HERE IF REQUIRED
# ENV CUSTOM_REGISTRY https://registry.npmjs.org/ 
# RUN npm config set strict-ssl false
# RUN npm config set registry $CUSTOM_REGISTRY

RUN git clone https://github.com/phetsims/assert.git
RUN git clone https://github.com/phetsims/axon.git
RUN git clone https://github.com/phetsims/babel.git
RUN git clone https://github.com/phetsims/brand.git
RUN git clone https://github.com/phetsims/chipper.git
RUN git clone https://github.com/phetsims/dot.git
RUN git clone https://github.com/phetsims/joist.git
RUN git clone https://github.com/phetsims/kite.git
RUN git clone https://github.com/lauterbur/phet-nitroglycerin.git
RUN git clone https://github.com/phetsims/perennial.RUN git perennial-alias
RUN git clone https://github.com/phetsims/phet-core.git
RUN git clone https://github.com/phetsims/phetcommon.git
RUN git clone https://github.com/phetsims/phetmarks.git
RUN git clone https://github.com/phetsims/query-string-machine.git
RUN git clone https://github.com/lauterbur/reactants-products-and-leftovers.git
RUN git clone https://github.com/phetsims/scenery.git
RUN git clone https://github.com/phetsims/scenery-phet.git
RUN git clone https://github.com/phetsims/sherpa.git
RUN git clone https://github.com/phetsims/sun.git
RUN git clone https://github.com/phetsims/tambo.git
RUN git clone https://github.com/phetsims/tandem.git
RUN git clone https://github.com/phetsims/twixt.git
RUN git clone https://github.com/phetsims/utterance-queue.git
RUN git clone https://github.com/phetsims/vegas.git

RUN cd chipper
RUN npm install
RUN cd ../perennial-alias
RUN npm install
RUN cd ../reactants-products-and-leftovers
RUN npm install
