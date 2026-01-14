import { useDiv, useButton } from '@trippler/tr_kit/nui'
import { selectMode } from '../../modules/onboarding'

document.body.id = 'body'
useDiv({
  parent: "body",
  id: "root"
})

useDiv({
  parent: "root",
  id: "main-menu",
  style: "hidden w-[100vw] h-[100vh] flex items-end justify-center py-52 bg-stone-900/20 bg-[url(https://r2.fivemanage.com/COKMc8Wcmk9K5dp547rEw/onboardingbg2.jpg)] bg-cover bg-center"
})

useDiv({
  parent: "main-menu",
  id: "dashboard-content",
  style: "flex flex-col items-center gap-5"    
})

useButton({
  parent: "dashboard-content",
  id: "dashboard-button",
  content: "Competitive",
  size: "5xl",
  type: "primary",
  onClick: () => selectMode('competitive')
})

useButton({
  parent: "dashboard-content",
  id: "dashboard-button",
  content: "Freeroam",
  size: "5xl",
  type: "soft",
  onClick: () => selectMode('freeroam')
})
