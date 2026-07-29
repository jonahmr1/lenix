import { useEffect, useState } from 'react'
import './App.css'
import Container from './elements/components/container'
import Header from './elements/components/header'
import SearchBar from './elements/components/search'
import Groups from './elements/components/group'
import type {
  DynamicButtonFeature,
  InputDropdownFeature,
  RadioDropdownFeature,
  RangeDropdownFeature,
  States,
  StaticButtonFeature
} from './types'
import ResetButton from './elements/components/reset'
import StaticButtons from './elements/staticButtons'
import DynamicButtons from './elements/dynamicButtons'
import DropdownInputs from './elements/InputsDropdown'
import DropdownRanges from './elements/rangesDropdown'
import DropdownRadios from './elements/radiosDropdown'
import { GetConfig } from '.'

const App = () => {
  const [search, setSearch] = useState<string | null>(null)
  const [displayState, setDisplayState] = useState(true)
  const [buttonsStates, setButtonsStates] = useState<States>(null)
  const {
    staticButtonFeatures,
    dynamicButtonFeatures,
    inputFeatures,
    rangeFeatures,
    radioFeatures,
  }: {
    staticButtonFeatures: StaticButtonFeature
    dynamicButtonFeatures: DynamicButtonFeature
    inputFeatures: InputDropdownFeature
    rangeFeatures: RangeDropdownFeature
    radioFeatures: RadioDropdownFeature
  } = GetConfig(search)

  window.addEventListener('message', ({ data: { action } }) => action === 'showMenu' && setDisplayState(true))

  useEffect(() => {
    if (!displayState) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDisplayState(false)
        document.removeEventListener('keydown', handler)
        fetch(`https://${GetParentResourceName()}/hideMenu`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({}),
        });
      }
    }
    document.addEventListener('keydown', handler)
  }, [displayState])

  return (
    <Container {...{ displayState }}>
      <Header/>
      <ResetButton/>
      <SearchBar {...{ setSearch }}/>
      <Groups>
        <h3 className='Header' >Statics</h3>
        <StaticButtons {...{ feature: staticButtonFeatures }} />
        <h3 className='Header' >Dynamics</h3>
        <DynamicButtons {...{ feature: dynamicButtonFeatures }} />
        <h3 className='Header' >Inputs</h3>
        <DropdownInputs {...{ feature: inputFeatures, buttonsStates, setButtonsStates }} />
        <h3 className='Header' >Ranges</h3>
        <DropdownRanges {...{ feature: rangeFeatures, buttonsStates, setButtonsStates }} />
        <h3 className='Header' >Range Radios</h3>
        <DropdownRadios {...{ feature: radioFeatures, buttonsStates, setButtonsStates }} />
      </Groups>
    </Container>
  )
}

export default App