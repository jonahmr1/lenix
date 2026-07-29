import type { SetState } from "../../types"

const Search = ({ setSearch }: { setSearch: SetState<string | null> }) =>
<input
  type="text"
  placeholder='Search for a feature'
  className="text-black"
  onChange={({ target: { value } }) => setSearch(value) }
/>

export default Search