import React from 'react'
import CDSInline from '../images/big-icons/CDS-inline.svg'
import AptamerInline from '../images/big-icons/aptamer-inline.svg'
import AssemblyScarInline from '../images/big-icons/assembly-scar-inline.svg'
import BiopolymerBaseInline from '../images/big-icons/biopolymer-base-inline.svg'
import BluntRestrictionSiteInline from '../images/big-icons/blunt-restriction-site-inline.svg'
import DnaStabilityInline from '../images/big-icons/dna-stability-inline.svg'
import EngineeredRegionInline from '../images/big-icons/engineered-region-inline.svg'
import Insulator from '../images/big-icons/insulator.svg'
import NoGlyphAssignedInline from '../images/big-icons/no-glyph-assigned-inline.svg'
import NonCodingRnaGeneInline from '../images/big-icons/non-coding-rna-gene-inline.svg'
import OperatorInline from '../images/big-icons/operator-inline.svg'
import OriginOfReplicationInline from '../images/big-icons/origin-of-replication-inline.svg'
import OriginOfTransferInline from '../images/big-icons/origin-of-transfer-inline.svg'
import OverhangSite5Inline from '../images/big-icons/overhang-site-5-inline.svg'
import OverhangSite5ReverseComplement from '../images/big-icons/overhang-site-5-reverseComplement.svg'
import PolyAInline from '../images/big-icons/poly-a-inline.svg'
import PrimerBindingSiteInline from '../images/big-icons/primer-binding-site-inline.svg'
import PromoterInline from '../images/big-icons/promoter-inline.svg'
import ProteinInline from '../images/big-icons/protein-inline.svg'
import RecombinationSiteInline from '../images/big-icons/recombination-site-inline.svg'
import ResInline from '../images/big-icons/res-inline.svg'
import RestrictionSiteInline from '../images/big-icons/restriction-site-inline.svg'
import RnaInline from '../images/big-icons/rna-inline.svg'
import SignatureInline from '../images/big-icons/signature-inline.svg'
import StickyRestrictionSite3Inline from '../images/big-icons/sticky-restriction-site-3-inline.svg'
import StickyRestrictionSite5Inline from '../images/big-icons/sticky-restriction-site-5-inline.svg'
import TerminatorInline from '../images/big-icons/terminator-inline.svg'
import UnspecifiedInline from '../images/big-icons/unspecified-inline.svg'

const ICON_MAPPING = {
  'cds': CDSInline,
  'aptamer': AptamerInline,
  'assembly-scar': AssemblyScarInline,
  'biopolymer-base': BiopolymerBaseInline,
  'blunt-restriction-site': BluntRestrictionSiteInline,
  'dna-stability': DnaStabilityInline,
  'engineered-region': EngineeredRegionInline,
  'insulator': Insulator,
  'no-glyph-assigned': NoGlyphAssignedInline,
  'non-coding-rna-gene': NonCodingRnaGeneInline,
  'operator': OperatorInline,
  'origin-of-replication': OriginOfReplicationInline,
  'origin-of-transfer': OriginOfTransferInline,
  'overhang-site-5': OverhangSite5Inline,
  'poly-a': PolyAInline,
  'primer-binding-site': PrimerBindingSiteInline,
  'promoter': PromoterInline,
  'protein': ProteinInline,
  'recombination-site': RecombinationSiteInline,
  'res': ResInline,
  'ribosome-entry-site': ResInline, // EXCEPTION
  'restriction-site': RestrictionSiteInline,
  'rna': RnaInline,
  'signature': SignatureInline,
  'sticky-restriction-site-3': StickyRestrictionSite3Inline,
  'sticky-restriction-site-5': StickyRestrictionSite5Inline,
  'terminator': TerminatorInline,
  'unspecified': UnspecifiedInline,
  // Only exception of not rotated
  'overhang-site-5-reverseComplement': OverhangSite5ReverseComplement,
}

export default function SymbolSVG({ role, orientation }) {
  const cleanedRole = role.replaceAll('_', '-').toLowerCase()
  const isReverse = orientation === 'reverseComplement'
  const InlineIcon = ICON_MAPPING[cleanedRole]
  const ReverseIconIfExists = ICON_MAPPING[cleanedRole +'-reverseComplement']

  let Icon = (isReverse && ReverseIconIfExists) || InlineIcon
  let toRotate = isReverse && !ReverseIconIfExists

  if (!Icon) {
    console.log(`Missing icon for role = "${role}"! Using the UnspecifiedInline icon...`)
    Icon = UnspecifiedInline
    toRotate = false
  }
  return (
    <svg width="190px" height="160px" style={{
      transform: toRotate ? 'rotate(180deg)' : '',
    }}>
      <path d="M0,80 L40,80 M140,80 L190,80" stroke="black" strokeWidth="2" />
      <Icon x={40} viewBox="0 40 100 80" width="100" height="160" />
    </svg>
  )
}
