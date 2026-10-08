import { StatesContext } from "@/app/tone/provider";
import { useContext } from "react"

export const useStates = () => {
	const context = useContext(StatesContext);
  if (!context) throw new Error("StatesProvider is missing");

	return context
}