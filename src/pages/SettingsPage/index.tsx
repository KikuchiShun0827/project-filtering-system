import { PageHeader } from '../../components/PageHeader'
import SectionCard from '../../components/SectionCard'
import { useSettings } from '../../store/SettingsContext'
import AccountSection from './AccountSection'
import ClassifierSection from './ClassifierSection'
import DisplaySection from './DisplaySection'

const SettingsPage = () => {
  const { reset } = useSettings()

  return (
    <>
      <PageHeader
        title="設定"
        actions={
          <button className="btn btn-sm" onClick={reset}>
            初期状態に戻す
          </button>
        }
      />

      <div className="stack" style={{ maxWidth: 860 }}>
        <SectionCard label="連携するメールアカウント">
          <AccountSection />
        </SectionCard>

        <SectionCard label="表示">
          <DisplaySection />
        </SectionCard>

        <SectionCard label="メール分類">
          <ClassifierSection />
        </SectionCard>
      </div>
    </>
  )
}

export default SettingsPage
