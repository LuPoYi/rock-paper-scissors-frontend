import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { choiceIcons } from '@/constants'

const ChoiceButton = ({
  choiceIndex,
  onChoice,
}: {
  choiceIndex: number
  onChoice: (choiceIndex: number) => void
}) => (
  <div
    className={`w-20 h-20 flex flex-row items-center rounded-full justify-center shadow-md bg-slate-200 text-slate-900 animate-beacon animation-delay-${choiceIndex} cursor-pointer`}
    onClick={() => onChoice(choiceIndex)}
  >
    <FontAwesomeIcon icon={choiceIcons[choiceIndex].icon} className="text-4xl" />
  </div>
)

export default ChoiceButton
