import { OverviewCards } from './overview-cards'
import { CaptationChart } from './captation-chart'
import { AllocationChart } from './allocation-chart'

export function Dashboard() {
  return (
    <div className="space-y-6">
      <OverviewCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CaptationChart />
        <AllocationChart />
      </div>
    </div>
  )
}

