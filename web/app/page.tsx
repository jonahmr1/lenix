import { Layout } from '@/components/layout'
import { Nav } from '@/components/nav'
import { Stats } from '@/components/stats'
import { H1, H3, Lead, Muted } from '@/components/typography'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { CURRENT_USERNAME } from '@/lib/utils'
import {
  GithubLogoIcon,
  CreditCardIcon,
  FileTextIcon,
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

const buttons = [
  {
    label: 'Fund',
    link: 'https://buy.polar.sh/polar_cl_ihhMVbNL2cuRAKiafieSfHSXpcaGfSNK0sn1N0zqZtx',
    icon: <CreditCardIcon />,
  },
  {
    label: 'GitHub',
    link: `https://github.com/${CURRENT_USERNAME}`,
    icon: <GithubLogoIcon />,
  },
  {
    label: 'Resume',
    link: 'resume.pdf',
    icon: <FileTextIcon />,
  },
]

export default async function Page() {
  return (
    <Layout className="pt-0">
      <Nav />
      <div className="flex min-h-screen flex-col justify-center gap-10">
        <div className="flex flex-col items-start">
          <Muted className="font-light tracking-widest uppercase opacity-60">
            01 / Introduction
          </Muted>
          <H1 className="text-primary">Lenix</H1>
          <Lead>Self-taught software engineer</Lead>
          <Muted className="opacity-50">
            AI & Product Engineer / FiveM Specialist / Technical Consultant
          </Muted>
        </div>
        <ButtonGroup className="w-full justify-center">
          {buttons.map((button) => (
            <Button key={button.label} variant="outline">
              <Link className="no-underline" href={button.link}>
                {button.label}
              </Link>
              {button.icon}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <div className="flex justify-between gap-20 portrait:flex-col">
        <div className="flex flex-col items-start">
          <Muted className="mt-0 font-light tracking-widest uppercase opacity-60">
            02 / About
          </Muted>
          <H1 className="text-primary">Mentality</H1>
        </div>
        <div className="flex w-full flex-col gap-10 divide-y-2">
          {[
            {
              head: 'Focus',
              body: 'Always quality over quantity, Fewer but better.',
            },
            {
              head: 'Philosophy',
              body: 'Niche solutions, Clean code, Clear documentation',
            },
            {
              head: 'Purpose',
              body: 'Reliablity & Performance first, Privacy & Security by design.',
            },
          ].map(({ head, body }, i) => (
            <div
              key={i}
              className="flex items-center justify-between not-last:pb-10 portrait:gap-5"
            >
              <div className="flex items-start gap-10">
                <p className="mt-0">0{i + 1}</p>
                <H3 className="mt-0 text-primary">{head}</H3>
              </div>
              <p className="mt-0">{body}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-20">
        <div className="flex flex-col items-start">
          <Muted className="mt-0 font-light tracking-widest uppercase opacity-60">
            03 / Numbers
          </Muted>
          <H1 className="text-primary">Stats</H1>
        </div>
        <Stats />
      </div>
    </Layout>
  )
}

{
  /* <a href="https://buy.polar.sh/polar_cl_ihhMVbNL2cuRAKiafieSfHSXpcaGfSNK0sn1N0zqZtx" data-polar-checkout data-polar-checkout-theme="dark">Purchase</a>
<script src="https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js" defer data-auto-init></script> */
}
