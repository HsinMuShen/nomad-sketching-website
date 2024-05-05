import { Icon } from 'src/components/common/ui'

const LoadingState = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Icon icon="i-mdi-loading" size="xl" className="origin-center animate-spin" />
    </div>
  )
}
export default LoadingState
