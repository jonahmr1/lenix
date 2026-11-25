import { SearchForm } from '@/components/tone/search-form'
import { SearchResults } from '@/components/tone/search-results'

export default function TonePage() {
  return (
    <div className='not-typeset flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6'>
      <SearchForm />
      <SearchResults />
    </div>
  )
}
