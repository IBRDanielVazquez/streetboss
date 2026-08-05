import React from 'react';
import LandingSocialProof from './LandingSocialProof';
import LandingCalculadora from './LandingCalculadora';
import LandingSolucion from './LandingSolucion';
import LandingPrecios from './LandingPrecios';
import LandingDemosCTA from './LandingDemosCTA';
import LandingFAQ from './LandingFAQ';

export default function LandingContent() {
  return (
    <>
      <LandingSocialProof />
      <LandingCalculadora />
      <LandingSolucion />
      <LandingPrecios />
      <LandingDemosCTA />
      <LandingFAQ />
    </>
  );
}
