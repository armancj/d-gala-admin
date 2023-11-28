import { TDoughnutChartData } from '../types'
import { useColors } from 'vuestic-ui'
const { colors } = useColors()

export const doughnutChartData: TDoughnutChartData = {
  labels: ['Las Tunas', 'Holguin', 'Camaguey'],
  datasets: [
    {
      label: 'Population (millions)',
      backgroundColor: [colors.success, colors.danger, colors.info],
      data: [500, 600, 300],
    },
  ],
}
