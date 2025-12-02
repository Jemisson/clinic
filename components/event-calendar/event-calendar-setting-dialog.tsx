'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { LOCALES } from '@/constants/calendar-constant'
import { useEventCalendarStore } from '@/hooks/use-event'
import { getLocalizedDaysOfWeek } from '@/lib/date'
import { getLocaleFromCode } from '@/lib/event'
import {
  CalendarViewConfigs,
  CalendarViewType,
  DayViewConfig,
  MonthViewConfig,
  TimeFormatType,
  ViewModeType,
  WeekViewConfig,
  YearViewConfig,
} from '@/types/event'
import {
  Calendar,
  CalendarDays,
  Clock,
  Eye,
  Globe,
  Settings,
  Sun,
} from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { useState, useTransition } from 'react'
import { useShallow } from 'zustand/shallow'
import { ScrollArea } from '../ui/scroll-area'

const VIEW_TYPES = [
  { value: 'day', label: 'Dia' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
  { value: 'year', label: 'Ano' },
] as const

const VIEW_MODES = [
  { value: 'calendar', label: 'Modo calendário' },
  { value: 'list', label: 'Modo Lista' },
] as const

const TABS = [
  { id: 'general', label: 'Geral', icon: Settings },
  { id: 'calendar', label: 'Calendário', icon: Calendar },
] as const

const ConfigRow = ({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) => (
  <div className="flex items-center justify-between py-3">
    <div className="min-w-0 flex-1 pr-4">
      <div className="text-foreground text-sm font-medium">{label}</div>
      {description && (
        <div className="text-muted-foreground mt-1 text-xs">{description}</div>
      )}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
)

const ConfigSection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) => (
  <div className="space-y-4">
    <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
      <Icon className="h-4 w-4" />
      {title}
    </div>
    <div className="space-y-1">{children}</div>
  </div>
)

interface GeneralSettingsProps {
  currentView: CalendarViewType
  viewMode: ViewModeType
  timeFormat: TimeFormatType
  locale: string
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
  handleViewChange: (value: CalendarViewType) => void
  setMode: (value: ViewModeType) => void
  setTimeFormat: (value: TimeFormatType) => void
  setLocale: (value: string) => void
  setFirstDayOfWeek: (value: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void
}

export default function EventCalendarSettingsDialog() {
  const {
    currentView,
    viewMode,
    timeFormat,
    locale,
    firstDayOfWeek,
    viewSettings,
    setView,
    setMode,
    setTimeFormat,
    setLocale,
    setFirstDayOfWeek,
    updateDayViewConfig,
    updateWeekViewConfig,
    updateMonthViewConfig,
    updateYearViewConfig,
  } = useEventCalendarStore(
    useShallow((state) => ({
      currentView: state.currentView,
      viewMode: state.viewMode,
      timeFormat: state.timeFormat,
      locale: state.locale,
      firstDayOfWeek: state.firstDayOfWeek,
      daysCount: state.daysCount,
      viewSettings: state.viewSettings,
      setView: state.setView,
      setMode: state.setMode,
      setTimeFormat: state.setTimeFormat,
      setLocale: state.setLocale,
      setFirstDayOfWeek: state.setFirstDayOfWeek,
      setDaysCount: state.setDaysCount,
      updateDayViewConfig: state.updateDayViewConfig,
      updateDaysViewConfig: state.updateDaysViewConfig,
      updateWeekViewConfig: state.updateWeekViewConfig,
      updateMonthViewConfig: state.updateMonthViewConfig,
      updateYearViewConfig: state.updateYearViewConfig,
    })),
  )

  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('general')
  const [, startTransition] = useTransition()
  const [, setQueryView] = useQueryState(
    'view',
    parseAsString.withOptions({
      shallow: false,
      throttleMs: 3,
      startTransition,
    }),
  )

  const handleViewChange = (value: CalendarViewType) => {
    setQueryView(value)
    setView(value)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Configurações de calendário
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-hidden p-0 sm:max-w-3xl">
        <div className="flex h-full">
          <div className="bg-muted/20 w-56 border-r p-4">
            <div className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className={`text-sm`}>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Calendário
              </DialogTitle>
              <DialogDescription>
                Customize a aparência e informações do seu calendário
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <ScrollArea className="h-[400px] w-full pr-4">
                {activeTab === 'general' && (
                  <GeneralSettings
                    currentView={currentView}
                    viewMode={viewMode}
                    timeFormat={timeFormat}
                    locale={locale}
                    firstDayOfWeek={firstDayOfWeek}
                    handleViewChange={handleViewChange}
                    setMode={setMode}
                    setTimeFormat={setTimeFormat}
                    setLocale={setLocale}
                    setFirstDayOfWeek={setFirstDayOfWeek}
                  />
                )}
                {activeTab === 'calendar' && (
                  <CalendarSettings
                    viewSettings={viewSettings}
                    updateDayViewConfig={updateDayViewConfig}
                    updateWeekViewConfig={updateWeekViewConfig}
                    updateMonthViewConfig={updateMonthViewConfig}
                    updateYearViewConfig={updateYearViewConfig}
                  />
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const GeneralSettings = ({
  currentView,
  viewMode,
  timeFormat,
  locale,
  firstDayOfWeek,
  handleViewChange,
  setMode,
  setTimeFormat,
  setLocale,
  setFirstDayOfWeek,
}: GeneralSettingsProps) => {
  const localeObj = getLocaleFromCode(locale)
  const localizedDays = getLocalizedDaysOfWeek(localeObj)
  return (
    <div className="space-y-8">
      <ConfigSection
        title="Tela & Formato"
        icon={Eye}
      >
        <ConfigRow
          label="Padrão de visualização"
          description="Escolha a visualização inicial do calendário"
        >
          <Select
            value={currentView}
            onValueChange={handleViewChange}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VIEW_TYPES.map((type) => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ConfigRow>
        <ConfigRow
          label="Modo de exibição"
          description="Escolha entre modo calendário ou lista"
        >
          <Select
            value={viewMode}
            onValueChange={(value: ViewModeType) => setMode(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VIEW_MODES.map((mode) => (
                <SelectItem
                  key={mode.value}
                  value={mode.value}
                >
                  {mode.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ConfigRow>
        <ConfigRow
          label="Formato de hora"
          description="Escolha entre formato de 12 ou 24 horas"
        >
          <Select
            value={timeFormat}
            onValueChange={(value: TimeFormatType) => setTimeFormat(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 horas (AM/PM)</SelectItem>
              <SelectItem value="24">24 horas</SelectItem>
            </SelectContent>
          </Select>
        </ConfigRow>
      </ConfigSection>
      <Separator />
      <ConfigSection
        title="Idioma & Região"
        icon={Globe}
      >
        <ConfigRow
          label="Idioma"
          description="Selecione o idioma do calendário"
        >
          <Select
            value={locale}
            onValueChange={setLocale}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Selecione um idioma" />
            </SelectTrigger>
            <SelectContent>
              {LOCALES.map((loc) => (
                <SelectItem
                  key={loc.value}
                  value={loc.value}
                >
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ConfigRow>
        <ConfigRow
          label="Primeiro dia da semana"
          description="Defina qual dia inicia a semana no calendário"
        >
          <Select
            value={firstDayOfWeek.toString()}
            onValueChange={(value) =>
              setFirstDayOfWeek(parseInt(value) as 0 | 1 | 2 | 3 | 4 | 5 | 6)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {localizedDays.map((day) => (
                <SelectItem
                  key={day.value}
                  value={day.value.toString()}
                >
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ConfigRow>
      </ConfigSection>
    </div>
  )
}

const CalendarSettings = ({
  viewSettings,
  updateDayViewConfig,
  updateWeekViewConfig,
  updateMonthViewConfig,
  updateYearViewConfig,
}: {
  viewSettings: CalendarViewConfigs
  updateDayViewConfig: (config: Partial<DayViewConfig>) => void
  updateWeekViewConfig: (config: Partial<WeekViewConfig>) => void
  updateMonthViewConfig: (config: Partial<MonthViewConfig>) => void
  updateYearViewConfig: (config: Partial<YearViewConfig>) => void
}) => (
  <div className="space-y-8">
    <ConfigSection
      title="Visualiação por Dia"
      icon={Clock}
    >
      <ConfigRow
        label="Mostrar indicador de hora atual"
        description="Mostrar linha vermelha na hora atual"
      >
        <Switch
          checked={viewSettings.day.showCurrentTimeIndicator}
          onCheckedChange={(checked) =>
            updateDayViewConfig({ showCurrentTimeIndicator: checked })
          }
        />
      </ConfigRow>
      <ConfigRow
        label="Mostrar indicador de hora ao passar o mouse"
        description="Mostrar hora ao passar o mouse sobre os intervalos de tempo"
      >
        <Switch
          checked={viewSettings.day.showHoverTimeIndicator}
          onCheckedChange={(checked) =>
            updateDayViewConfig({ showHoverTimeIndicator: checked })
          }
        />
      </ConfigRow>
      <ConfigRow
        label="Clicar em intervalos de tempo para criar agendamentos"
        description="Permitir clicar em intervalos de tempo para criar novos agendamentos"
      >
        <Switch
          checked={viewSettings.day.enableTimeSlotClick}
          onCheckedChange={(checked) =>
            updateDayViewConfig({ enableTimeSlotClick: checked })
          }
        />
      </ConfigRow>
    </ConfigSection>

    <Separator />

    <ConfigSection
      title="Visualização por Semana"
      icon={CalendarDays}
    >
      <ConfigRow
        label="Destacar o dia atual"
        description="Destacar o dia atual na visualização semanal"
      >
        <Switch
          checked={viewSettings.week.highlightToday}
          onCheckedChange={(checked) =>
            updateWeekViewConfig({ highlightToday: checked })
          }
        />
      </ConfigRow>
      <ConfigRow
        label="Indicador de hora atual"
        description="Mostrar linha vermelha na hora atual"
      >
        <Switch
          checked={viewSettings.week.showCurrentTimeIndicator}
          onCheckedChange={(checked) =>
            updateWeekViewConfig({ showCurrentTimeIndicator: checked })
          }
        />
      </ConfigRow>
      <ConfigRow
        label="Indicador de hora ao passar o mouse"
        description="Mostrar hora ao passar o mouse sobre os intervalos de tempo"
      >
        <Switch
          checked={viewSettings.week.showHoverTimeIndicator}
          onCheckedChange={(checked) =>
            updateWeekViewConfig({ showHoverTimeIndicator: checked })
          }
        />
      </ConfigRow>
      <ConfigRow
        label="Clique em intervalos de tempo para criar agendamentos"
        description="Permitir clicar em intervalos de tempo para criar novos agendamentos"
      >
        <Switch
          checked={viewSettings.week.enableTimeSlotClick}
          onCheckedChange={(checked) =>
            updateWeekViewConfig({ enableTimeSlotClick: checked })
          }
        />
      </ConfigRow>
      <ConfigRow
        label="Clique em blocos de tempo para criar agendamentos"
        description="Permitir clicar em blocos de tempo para criar novos agendamentos"
      >
        <Switch
          checked={viewSettings.week.enableTimeBlockClick}
          onCheckedChange={(checked) =>
            updateWeekViewConfig({ enableTimeBlockClick: checked })
          }
        />
      </ConfigRow>
      <ConfigRow
        label="Expandir agendamentos de vários dias"
        description="Mostrar agendamentos que se estendem por vários dias em toda a sua duração"
      >
        <Switch
          checked={viewSettings.week.expandMultiDayEvents}
          onCheckedChange={(checked) =>
            updateWeekViewConfig({ expandMultiDayEvents: checked })
          }
        />
      </ConfigRow>
    </ConfigSection>
    <Separator />
    <ConfigSection
      title="Visualização por Mês"
      icon={CalendarDays}
    >
      <ConfigRow
        label="Limite de agendamentos"
        description="Número máximo de agendamentos exibidos por dia"
      >
        <Input
          type="number"
          value={viewSettings.month.eventLimit}
          onChange={(e) =>
            updateMonthViewConfig({ eventLimit: parseInt(e.target.value) })
          }
          className="w-20 text-center"
          min={1}
          max={10}
        />
      </ConfigRow>
      <ConfigRow
        label="Mostrar indicador de mais agendamentos"
        description="Mostrar +X mais quando os agendamentos excedem o limite"
      >
        <Switch
          checked={viewSettings.month.showMoreEventsIndicator}
          onCheckedChange={(checked) =>
            updateMonthViewConfig({ showMoreEventsIndicator: checked })
          }
        />
      </ConfigRow>
      <ConfigRow
        label="Ocultar dias fora do mês"
        description="Não exibir dias que não pertencem ao mês atual"
      >
        <Switch
          checked={viewSettings.month.hideOutsideDays}
          onCheckedChange={(checked) =>
            updateMonthViewConfig({ hideOutsideDays: checked })
          }
        />
      </ConfigRow>
    </ConfigSection>
    <Separator />
    <ConfigSection
      title="Visualização por Ano"
      icon={Sun}
    >
      <ConfigRow
        label="Mostrar nomes dos meses"
        description="Exibir nomes dos meses na visualização anual"
      >
        <Switch
          checked={viewSettings.year.showMonthLabels}
          onCheckedChange={(checked) =>
            updateYearViewConfig({ showMonthLabels: checked })
          }
        />
      </ConfigRow>
      <ConfigRow
        label="Visualização por trimestre"
        description="Exibir o ano dividido em quatro trimestres"
      >
        <Switch
          checked={viewSettings.year.quarterView}
          onCheckedChange={(checked) =>
            updateYearViewConfig({ quarterView: checked })
          }
        />
      </ConfigRow>
      <ConfigRow
        label="Destacar o mês atual"
        description="Destacar o mês atual na visualização anual"
      >
        <Switch
          checked={viewSettings.year.highlightCurrentMonth}
          onCheckedChange={(checked) =>
            updateYearViewConfig({ highlightCurrentMonth: checked })
          }
        />
      </ConfigRow>
      <ConfigRow
        label="Mostrar pré-visualização de Agendamentos"
        description="Exibir uma pré-visualização dos Agendamentos em cada mês"
      >
        <Switch
          checked={viewSettings.year.enableEventPreview}
          onCheckedChange={(checked) =>
            updateYearViewConfig({ enableEventPreview: checked })
          }
        />
      </ConfigRow>
      {viewSettings.year.enableEventPreview && (
        <>
          <ConfigRow
            label="Agendamentos de pré-visualização por mês"
            description="Número de Agendamentos exibidos na pré-visualização de cada mês"
          >
            <Input
              type="number"
              value={viewSettings.year.previewEventsPerMonth}
              onChange={(e) =>
                updateYearViewConfig({
                  previewEventsPerMonth: parseInt(e.target.value),
                })
              }
              className="w-20 text-center"
              min={1}
              max={10}
            />
          </ConfigRow>
          <ConfigRow
            label="Mostrar indicador de mais agendamentos"
            description="Mostrar +X mais quando os agendamentos excedem o limite de pré-visualização"
          >
            <Switch
              checked={viewSettings.year.showMoreEventsIndicator}
              onCheckedChange={(checked) =>
                updateYearViewConfig({ showMoreEventsIndicator: checked })
              }
            />
          </ConfigRow>
        </>
      )}
    </ConfigSection>
  </div>
)
